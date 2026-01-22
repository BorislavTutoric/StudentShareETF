package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions;

public class PasswordNotFoundException extends Exception {

    public PasswordNotFoundException() {
        super("Stara lozinka nije ispravna");
    }
    public PasswordNotFoundException(String message) {
        super(message);
    }
}
