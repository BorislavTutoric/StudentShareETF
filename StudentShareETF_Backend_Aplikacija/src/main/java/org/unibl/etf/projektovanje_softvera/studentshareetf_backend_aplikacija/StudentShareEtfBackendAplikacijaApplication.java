package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class StudentShareEtfBackendAplikacijaApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentShareEtfBackendAplikacijaApplication.class, args);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        System.out.println(passwordEncoder.encode("jovan123"));
    }

}
