package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

public class HeartbeatRequest {

    private String modul;

    public HeartbeatRequest() {
    }

    public HeartbeatRequest(String modul) {
        this.modul = modul;
    }

    public String getModul() {
        return modul;
    }

    public void setModul(String modul) {
        this.modul = modul;
    }
}
