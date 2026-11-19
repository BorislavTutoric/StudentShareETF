package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ModuleStatResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ModulesResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MonthStatResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MonthlyResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.ModuleActivityRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ActivityStatisticsService {

    private final ModuleActivityRepository repo;
    private final UserRepository userRepository;

    private double zaokruzi(double v) { return Math.round(v * 10) / 10.0; }

    public ModulesResponse vrijemePoModulima(LocalDate od, LocalDate dop) {
        var redovi = repo.statistikaPoModulima(od, dop);
        long ukupno = redovi.stream().mapToLong(r -> r.getUkupno()).sum();
        long aktivni = repo.brojAktivnihStudenata(od, dop);

        List<ModuleStatResponse> moduli = redovi.stream().map(r -> new ModuleStatResponse(
                r.getModul(),
                r.getUkupno(),
                ukupno == 0 ? 0 : zaokruzi(100.0 * r.getUkupno() / ukupno),
                r.getBrojStudenata(),
                r.getBrojStudenata() == 0 ? 0 : r.getUkupno() / r.getBrojStudenata()
        )).toList();

        return new ModulesResponse(ukupno, aktivni, moduli);
    }

    public MonthlyResponse koristenjePoMjesecima(int godina) {
        long ukupnoStudenata = userRepository.countByRoleAndActive("STUDENT", true);

        Map<Integer, ModuleActivityRepository.MjesecStat> poMjesecu = new HashMap<>();
        for (var r : repo.statistikaPoMjesecima(LocalDate.of(godina, 1, 1), LocalDate.of(godina, 12, 31))) {
            poMjesecu.put(r.getMjesec().intValue(), r);
        }

        List<MonthStatResponse> mjeseci = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            var r = poMjesecu.get(m);
            long ukupno = r == null ? 0 : r.getUkupno();
            long aktivni = r == null ? 0 : r.getAktivni();
            double postotak = ukupnoStudenata == 0 ? 0 : zaokruzi(100.0 * aktivni / ukupnoStudenata);
            mjeseci.add(new MonthStatResponse(m, ukupno, aktivni, postotak));
        }
        return new MonthlyResponse(godina, ukupnoStudenata, mjeseci);
    }
}
