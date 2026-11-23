package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskStatsResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.UpdateTaskRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Task;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.Modul;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.TipAkcije;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.TaskRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private static final String NASLOV_PODSJETNIKA = "Podsjetnik za obavezu! (id: %d)";

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final StudentService studentService;
    private final NotificationsService notificationsService;
    private final AuditLogService auditLogService;

    public List<TaskResponse> getTasksForDate(String month, String year, String username) {

        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);

        int m = Integer.parseInt(month);
        int y = Integer.parseInt(year);

        LocalDate startDate = LocalDate.of(y, m, 1);

        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        LocalDateTime startOfMonth = startDate.atStartOfDay();
        LocalDateTime endOfMonth = endDate.atTime(LocalTime.MAX);

        List<Task> tasks = taskRepository.findByStudentAndDatumVrijemeBetween(
                student, startOfMonth, endOfMonth
        );

        return tasks.stream()
                .map(this::uOdgovor)
                .collect(Collectors.toList());
    }

    public Integer createTask(String title, String description, String date, String time, String username,String way) {
        User user = userService.getUserByUsername(username);

        Student student = studentService.getStudentByUser(user);

        LocalDateTime dateTime = uDatumVrijeme(date, time);

        Task task = new Task();
        task.setNaslov(title);
        task.setOpis(description);
        task.setDatumVrijeme(dateTime);
        task.setStudent(student);
        task.setFakultetska(!"personal".equals(way));

        taskRepository.save(task);

        auditLogService.log(user, TipAkcije.KREIRANJE_OBAVEZE, Modul.KALENDAR_OBAVEZE, "OBAVEZA", task.getId(),
                "Korisnik \"" + user.getUsername() + "\" je kreirao " + (task.isFakultetska() ? "fakultetsku" : "ličnu")
                        + " obavezu \"" + title + "\" za " + dateTime.toLocalDate() + ".");

        kreirajPodsjetnike(task, student);

        return task.getId();
    }

    /**
     * PUT /api/tasks/{id}: mijenja naslov, opis, datum i vrijeme.
     * Stari podsjetnici se brišu i prave se novi (7, 3 i 1 dan prije novog roka),
     * osim ako je obaveza već obavljena.
     */
    @Transactional
    public TaskResponse updateTask(Integer taskId, UpdateTaskRequest request, String username) {
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        Task task = obavezaStudenta(taskId, student);

        if (request.getNaslov() == null || request.getNaslov().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Naslov obaveze je obavezan.");
        }
        if (request.getDatum() == null || request.getDatum().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datum obaveze je obavezan.");
        }

        LocalDateTime noviDatum;
        try {
            noviDatum = uDatumVrijeme(request.getDatum(), request.getVrijeme());
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Neispravan datum ili vrijeme.");
        }

        String stariNaslov = task.getNaslov();
        LocalDateTime stariDatum = task.getDatumVrijeme();

        task.setNaslov(request.getNaslov().trim());
        task.setOpis(request.getOpis());
        task.setDatumVrijeme(noviDatum);
        taskRepository.save(task);

        notificationsService.deleteTaskNotification(task.getId(), student);
        if (!task.isObavljena()) {
            kreirajPodsjetnike(task, student);
        }

        StringBuilder opis = new StringBuilder("Korisnik \"" + user.getUsername() + "\" je izmijenio obavezu \"" + stariNaslov + "\"");
        if (!stariNaslov.equals(task.getNaslov())) {
            opis.append(" (novi naslov: \"").append(task.getNaslov()).append("\")");
        }
        if (!stariDatum.equals(noviDatum)) {
            opis.append(", rok pomjeren sa ").append(formatRok(stariDatum)).append(" na ").append(formatRok(noviDatum));
        }
        opis.append(".");
        auditLogService.log(user, TipAkcije.IZMJENA_OBAVEZE, Modul.KALENDAR_OBAVEZE, "OBAVEZA", task.getId(), opis.toString());

        return uOdgovor(task);
    }

    /**
     * PATCH /api/tasks/{id}/done: označava obavezu kao (ne)obavljenu.
     * Kad je obavljena, brišu se podsjetnici koji još nisu stigli.
     * Kad se oznaka skine, ponovo se prave podsjetnici koji su još u budućnosti.
     */
    @Transactional
    public TaskResponse setDone(Integer taskId, boolean obavljena, String username) {
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        Task task = obavezaStudenta(taskId, student);

        if (task.isObavljena() == obavljena) {
            return uOdgovor(task);
        }

        task.setObavljena(obavljena);
        task.setDatumObavljanja(obavljena ? LocalDateTime.now() : null);
        taskRepository.save(task);

        if (obavljena) {
            notificationsService.deleteUpcomingTaskNotifications(task.getId(), student);
        } else {
            kreirajPodsjetnike(task, student);
        }

        auditLogService.log(user, TipAkcije.IZMJENA_OBAVEZE, Modul.KALENDAR_OBAVEZE, "OBAVEZA", task.getId(),
                "Korisnik \"" + user.getUsername() + "\" je označio obavezu \"" + task.getNaslov() + "\" kao "
                        + (obavljena ? "obavljenu" : "neobavljenu") + ".");

        return uOdgovor(task);
    }

    /**
     * GET /api/tasks/stats: obavljene, propuštene (rok prošao, nije označena), na čekanju,
     * procenat uspješnosti i raspodjela po mjesecima. Period (od/do, oba uključivo) se
     * odnosi na rok obaveze; bez perioda se gledaju sve obaveze.
     */
    public TaskStatsResponse getStats(String username, LocalDate od, LocalDate datumDo) {
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        LocalDateTime sada = LocalDateTime.now();

        long obavljene = 0, propustene = 0, naCekanju = 0;
        Map<YearMonth, long[]> poMjesecima = new TreeMap<>();

        for (Task t : taskRepository.findByStudent(student)) {
            LocalDate datum = t.getDatumVrijeme().toLocalDate();
            if (od != null && datum.isBefore(od)) continue;
            if (datumDo != null && datum.isAfter(datumDo)) continue;

            long[] mjesec = poMjesecima.computeIfAbsent(YearMonth.from(datum), k -> new long[3]);
            if (t.isObavljena()) {
                obavljene++;
                mjesec[0]++;
            } else if (rok(t).isBefore(sada)) {
                propustene++;
                mjesec[1]++;
            } else {
                naCekanju++;
                mjesec[2]++;
            }
        }

        long zavrsene = obavljene + propustene;
        Double procenat = zavrsene == 0 ? null : Math.round(obavljene * 1000.0 / zavrsene) / 10.0;

        List<TaskStatsResponse.Mjesec> mjeseci = new ArrayList<>();
        poMjesecima.forEach((ym, v) -> mjeseci.add(new TaskStatsResponse.Mjesec(ym.toString(), v[0], v[1], v[2])));

        return new TaskStatsResponse(obavljene + propustene + naCekanju, obavljene, propustene, naCekanju, procenat, mjeseci);
    }

    public void deleteTask(Integer taskId, String username) {
        User user = userService.getUserByUsername(username);

        Student student = studentService.getStudentByUser(user);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Obaveza ne postoji!"));

        if (!task.getStudent().getUserId().equals(student.getUserId())) {
            throw new RuntimeException("Nemate pravo brisati ovu obavezu!");
        }

        taskRepository.delete(task);

        notificationsService.deleteTaskNotification(taskId, student);

        auditLogService.log(user, TipAkcije.BRISANJE_OBAVEZE, Modul.KALENDAR_OBAVEZE, "OBAVEZA", taskId,
                "Korisnik \"" + user.getUsername() + "\" je obrisao obavezu \"" + task.getNaslov() + "\".");
    }

    // ---------------------------------------------------------------------

    private Task obavezaStudenta(Integer taskId, Student student) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Obaveza ne postoji!"));
        if (!task.getStudent().getUserId().equals(student.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nemate pravo mijenjati ovu obavezu!");
        }
        return task;
    }

    /** Pravi podsjetnike 7, 3 i 1 dan prije roka, samo one koji su još u budućnosti. */
    private void kreirajPodsjetnike(Task task, Student student) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dateTime = task.getDatumVrijeme();
        String naslov = String.format(NASLOV_PODSJETNIKA, task.getId());
        String title = task.getNaslov();

        LocalDateTime sevenDaysBefore = dateTime.minusDays(7);
        if (!sevenDaysBefore.isBefore(now)) {
            notificationsService.createNotification(naslov, "Vaša obaveza: " + title + " je za 7 dana",
                    student, now, sevenDaysBefore);
        }

        LocalDateTime threeDaysBefore = dateTime.minusDays(3);
        if (!threeDaysBefore.isBefore(now)) {
            String message = "Vaša obaveza: " + title + " je za 3 dana.";
            if (task.isFakultetska()) {
                message += "\nPrijavite ispit ako već niste!";
            }
            notificationsService.createNotification(naslov, message, student, now, threeDaysBefore);
        }

        LocalDateTime oneDayBefore = dateTime.minusDays(1);
        if (!oneDayBefore.isBefore(now)) {
            notificationsService.createNotification(naslov, "Vaša obaveza: " + title + " je za 1 dan",
                    student, now, oneDayBefore);
        }
    }

    /** Obaveza bez vremena (00:00) traje do kraja dana, pa nije propuštena dok dan ne prođe. */
    private static LocalDateTime rok(Task t) {
        LocalDateTime dt = t.getDatumVrijeme();
        return dt.toLocalTime().equals(LocalTime.MIDNIGHT) ? dt.toLocalDate().atTime(LocalTime.MAX) : dt;
    }

    private static LocalDateTime uDatumVrijeme(String date, String time) {
        LocalDate localDate = LocalDate.parse(date);
        LocalTime localTime = (time != null && !time.isBlank()) ? LocalTime.parse(time) : LocalTime.MIDNIGHT;
        return LocalDateTime.of(localDate, localTime);
    }

    private static String formatRok(LocalDateTime dt) {
        return dt.toLocalTime().equals(LocalTime.MIDNIGHT) ? dt.toLocalDate().toString()
                : dt.toLocalDate() + " " + dt.toLocalTime();
    }

    private TaskResponse uOdgovor(Task t) {
        LocalDateTime dt = t.getDatumVrijeme();
        return new TaskResponse(
                t.getId(),
                t.getNaslov(),
                t.getOpis(),
                dt.toLocalDate().toString(),
                dt.toLocalTime().toString(),
                t.isFakultetska(),
                t.isObavljena(),
                t.getDatumObavljanja() != null ? t.getDatumObavljanja().toString() : null
        );
    }
}
