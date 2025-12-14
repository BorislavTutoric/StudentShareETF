package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions;

public class AlreadySavedException extends Exception {
    public AlreadySavedException(){
        super("Već ste sačuvali materijal");
    }
    public AlreadySavedException(String message) {
        super(message);
    }
}
