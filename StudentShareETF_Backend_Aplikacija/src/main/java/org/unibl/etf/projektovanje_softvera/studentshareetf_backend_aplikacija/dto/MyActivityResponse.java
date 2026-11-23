package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import java.time.LocalDate;
import java.util.List;

/** GET /api/activity/me — ugovor iz plana (0.2). */
public record MyActivityResponse(
        long ukupnoSekundi,
        List<PoModulu> poModulu,
        List<PoDanu> poDanu
) {
    public record PoModulu(String modul, long sekundi) {}
    public record PoDanu(LocalDate datum, long sekundi) {}
}
