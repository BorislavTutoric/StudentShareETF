package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "KORISNIK")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "KorisnikId", nullable = false)
    private Integer userId;

    @Column(name = "Ime", nullable = false)
    private String name;

    @Column(name = "Prezime", nullable = false)
    private String surname;

    @Column(name = "KorisnickoIme", nullable = false)
    private String username;

    @Column(name = "Lozinka", nullable = false)
    private String password;

    @Column(name = "Uloga", nullable = false)
    private String role;

    @Column(name = "Aktivan", nullable = false)
    private boolean active = true;

    public User(){

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    public Integer getUserId(){
        return userId;
    }

    public void setUserId(Integer userId){
        this.userId = userId;
    }

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getSurname(){
        return surname;
    }

    public void setSurname(String surname){
        this.surname = surname;
    }

    @Override
    public String getUsername(){
        return username;
    }

    public void setUsername(String username){
        this.username = username;
    }

    @Override
    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public String getRole(){
        return role;
    }

    public void setRole(String role){
        this.role = role;
    }

    public boolean isActive(){return active;}

    public void setActive(boolean active){this.active = active;}

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
