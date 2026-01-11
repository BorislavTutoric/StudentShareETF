package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions;

public class EntityNotFoundException extends Exception {

    public EntityNotFoundException() {
        super("Entity not found");
    }
    public EntityNotFoundException(String message) {
        super(message);
    }
}
