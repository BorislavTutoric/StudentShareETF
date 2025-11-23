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

    public void sendChangeEmail(String toEmail, String token) {
        String subject = "Potvrda Email-a";
        String verificationUrl = "http://localhost:5173/verify?token=" + token;
        String message = "Kliknite na link da potvrdite vaš email:\n" + verificationUrl;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }

    public void sendPasswordChangeEmail(String toEmail, String token) {
        String subject = "Izmjena lozinke";
        String changePasswordUrl = "http://localhost:5173/password-change?token=" + token;
        String message = "Za izmjenu lozinke kliknite na link:\n" + changePasswordUrl;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }
}

