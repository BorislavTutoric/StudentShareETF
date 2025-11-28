package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions;

public class UnverifiedException extends Exception{

    public UnverifiedException(){
        super("Verifikujte vaš email!");
    }
    public UnverifiedException(String message){
        super(message);
    }
}
