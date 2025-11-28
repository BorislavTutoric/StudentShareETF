package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions;

public class EntityNotFound extends RuntimeException {

    public EntityNotFound() {
        super("Entity not found");
    }
    public EntityNotFound(String message) {
        super(message);
    }
}
