package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import java.util.List;

/**
 * GET /api/tasks/stats
 * procenatUspjesnosti = obavljene / (obavljene + propustene) * 100,
 * null kada još nijedna obaveza nije ni obavljena ni propuštena.
 */
public record TaskStatsResponse(
        long ukupno,
        long obavljene,
        long propustene,
        long naCekanju,
        Double procenatUspjesnosti,
        List<Mjesec> poMjesecima
) {
    /** mjesec u formatu YYYY-MM (prema roku obaveze) */
    public record Mjesec(String mjesec, long obavljene, long propustene, long naCekanju) {}
}
