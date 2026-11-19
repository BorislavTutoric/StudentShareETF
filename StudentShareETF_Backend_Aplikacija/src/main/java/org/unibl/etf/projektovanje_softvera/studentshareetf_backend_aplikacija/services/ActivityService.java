package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.ModuleActivityRepository;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private static final int SEKUNDI_PO_HEARTBEATU = 30;
    private static final long MIN_RAZMAK_SEK = 25;

    private final ModuleActivityRepository repo;
    private final UserService userService;
    private final ConcurrentHashMap<Integer, Instant> zadnji = new ConcurrentHashMap<>();

    @Transactional
    public boolean heartbeat(String username, String modul) {
        User u = userService.getUserByUsername(username);
        if (!"STUDENT".equals(u.getRole())) return false;

        Instant sad = Instant.now();
        AtomicBoolean prihvaceno = new AtomicBoolean(false);
        zadnji.compute(u.getUserId(), (k, prethodni) -> {
            if (prethodni != null && Duration.between(prethodni, sad).getSeconds() < MIN_RAZMAK_SEK)
                return prethodni;
            prihvaceno.set(true);
            return sad;
        });
        if (!prihvaceno.get()) return false;

        repo.dodajSekunde(u.getUserId(), modul, LocalDate.now(), SEKUNDI_PO_HEARTBEATU);
        return true;
    }
}
