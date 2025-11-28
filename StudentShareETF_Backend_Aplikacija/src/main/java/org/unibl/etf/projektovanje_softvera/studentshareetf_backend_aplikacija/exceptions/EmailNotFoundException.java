package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions;

public class EmailNotFoundException extends RuntimeException {

    public EmailNotFoundException() {
        super("Neodgovarajući email!");
    }
    public EmailNotFoundException(String message) {
        super(message);
    }
}
