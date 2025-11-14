package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "Potvrda registracije";
        String verificationUrl = "http://localhost:5173/verify?token=" + token; // link ka frontend-u
        String message = "Hvala što ste se registrovali. Kliknite na link da potvrdite vaš email:\n" + verificationUrl;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }
}

