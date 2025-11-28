package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(){
        super("Nepostojeće korisničko ime!");
    }
    public UserNotFoundException(String message) {
        super(message);
    }
}
