package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions;

public class AlreadySavedException extends Exception {
    public AlreadySavedException(){
        super("Materijal je već sačuvan!");
    }
    public AlreadySavedException(String message) {
        super(message);
    }
}
