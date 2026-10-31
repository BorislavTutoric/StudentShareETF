package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@SpringBootApplication
public class StudentShareEtfBackendAplikacijaApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentShareEtfBackendAplikacijaApplication.class, args);
    }

}
