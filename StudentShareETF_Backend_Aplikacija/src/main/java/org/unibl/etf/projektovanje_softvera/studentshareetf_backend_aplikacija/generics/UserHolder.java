package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics;

public class UserHolder<U> {
    private U user;

    public UserHolder() {}

    public UserHolder(U user) {
        this.user = user;
    }

    public U getUser() {
        return user;
    }

    public void setUser(U user) {
        this.user = user;
    }
}
