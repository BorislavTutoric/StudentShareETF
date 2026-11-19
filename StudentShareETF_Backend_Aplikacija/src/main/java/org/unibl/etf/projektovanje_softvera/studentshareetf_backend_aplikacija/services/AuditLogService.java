package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AuditLogResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.PagedResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.AuditLog;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.Modul;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.TipAkcije;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.AuditLogRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class AuditLogService {

    private static final int MAX_OPIS = 500;
    private static final int MAX_PAGE_SIZE = 100;
    private static final int MAX_USERNAME_U_OPISU = 100;

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final TransactionTemplate novaTransakcija;

    public AuditLogService(AuditLogRepository auditLogRepository,
                           UserRepository userRepository,
                           PlatformTransactionManager transactionManager) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.novaTransakcija = new TransactionTemplate(transactionManager);
        this.novaTransakcija.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    }

    public void log(User korisnik, TipAkcije tip, Modul modul,
                    String entitetTip, Integer entitetId, String opis) {
        AuditLog a = new AuditLog();
        a.setKorisnik(korisnik);
        a.setUloga(korisnik != null ? korisnik.getRole() : null);
        a.setTipAkcije(tip);
        a.setModul(modul);
        a.setEntitetTip(entitetTip);
        a.setEntitetId(entitetId);
        a.setOpis(skrati(opis, MAX_OPIS));
        a.setDatumVrijeme(LocalDateTime.now());

        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    upisi(a);
                }
            });
        } else {
            upisi(a);
        }
    }

    public void log(String username, TipAkcije tip, Modul modul,
                    String entitetTip, Integer entitetId, String opis) {
        User korisnik = nadjiKorisnika(username);
        log(korisnik, tip, modul, entitetTip, entitetId, opis);
    }

    public void logNeuspjesnaPrijava(String username, String razlog) {
        String ime = skrati(username == null ? "" : username, MAX_USERNAME_U_OPISU);
        User korisnik = nadjiKorisnika(ime);
        log(korisnik, TipAkcije.NEUSPJESNA_PRIJAVA, Modul.AUTENTIFIKACIJA,
                korisnik != null ? "KORISNIK" : null,
                korisnik != null ? korisnik.getUserId() : null,
                "Neuspješna prijava za korisničko ime \"" + ime + "\": " + razlog);
    }

    public User trenutniKorisnik() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !a.isAuthenticated() || a instanceof AnonymousAuthenticationToken) {
            return null;
        }
        if (a.getPrincipal() instanceof User u) {
            return u;
        }
        return nadjiKorisnika(a.getName());
    }

    @Transactional(readOnly = true)
    public PagedResponse<AuditLogResponse> pretraga(String korisnik, String uloga, TipAkcije tip, Modul modul,
                                                    LocalDate od, LocalDate datumDo, int page, int size) {
        return stranica(null, prazanUNull(korisnik), prazanUNull(uloga), tip, modul, od, datumDo, page, size);
    }

    @Transactional(readOnly = true)
    public PagedResponse<AuditLogResponse> moje(String username, Modul modul,
                                                LocalDate od, LocalDate datumDo, int page, int size) {
        User korisnik = userRepository.findByUsername(username).orElse(null);
        if (korisnik == null) {
            return new PagedResponse<>(List.of(), 0, size, 0, 0, false);
        }
        return stranica(korisnik.getUserId(), null, null, null, modul, od, datumDo, page, size);
    }

    private PagedResponse<AuditLogResponse> stranica(Integer korisnikId, String korisnik, String uloga,
                                                     TipAkcije tip, Modul modul,
                                                     LocalDate od, LocalDate datumDo, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        PageRequest pageRequest = PageRequest.of(safePage, safeSize,
                Sort.by(Sort.Direction.DESC, "datumVrijeme").and(Sort.by(Sort.Direction.DESC, "id")));

        Page<AuditLog> rezultat = auditLogRepository.pretraga(
                korisnikId, korisnik, uloga, tip, modul,
                od != null ? od.atStartOfDay() : null,
                datumDo != null ? datumDo.plusDays(1).atStartOfDay() : null,   // "do" je uključivo
                pageRequest);

        List<AuditLogResponse> content = rezultat.getContent().stream().map(this::uOdgovor).toList();
        return new PagedResponse<>(content, rezultat.getNumber(), rezultat.getSize(),
                rezultat.getTotalElements(), rezultat.getTotalPages(), rezultat.hasNext());
    }

    private AuditLogResponse uOdgovor(AuditLog a) {
        User k = a.getKorisnik();
        return new AuditLogResponse(
                a.getId(),
                a.getTipAkcije().name(),
                a.getModul().name(),
                a.getOpis(),
                a.getDatumVrijeme(),
                k != null ? k.getUserId() : null,
                k != null ? k.getUsername() : null,
                k != null ? k.getName() + " " + k.getSurname() : null,
                a.getUloga(),
                a.getEntitetTip(),
                a.getEntitetId());
    }


    private void upisi(AuditLog a) {
        try {
            novaTransakcija.executeWithoutResult(status -> auditLogRepository.save(a));
        } catch (Exception e) {
            log.warn("Audit log nije upisan ({} / {}): {}", a.getTipAkcije(), a.getModul(), e.getMessage());
        }
    }

    private User nadjiKorisnika(String username) {
        if (username == null || username.isBlank()) return null;
        try {
            return userRepository.findByUsername(username).orElse(null);
        } catch (Exception e) {
            log.warn("Audit log: korisnik \"{}\" nije učitan: {}", username, e.getMessage());
            return null;
        }
    }

    public static String isjecak(String sadrzaj) {
        if (sadrzaj == null) return "\"\"";
        String jedanRed = sadrzaj.replaceAll("\\s+", " ").trim();
        return "\"" + skrati(jedanRed, 80) + "\"";
    }

    private static String skrati(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max - 1) + "…";
    }

    private static String prazanUNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
