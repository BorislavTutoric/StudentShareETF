package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
public class StorageService {
    @Value("${b2.endpoint}") private String endpoint;
    @Value("${b2.region}") private String region;
    @Value("${b2.access-key}") private String accessKey;
    @Value("${b2.secret-key}") private String secretKey;
    @Value("${b2.bucket}") private String bucket;
    @Value("${b2.presign.expiration:300}") private long presignSeconds;

    private S3Client s3;
    private S3Presigner presigner;

    @PostConstruct
    public void init() {
        AwsBasicCredentials creds = AwsBasicCredentials.create(accessKey, secretKey);
        s3 = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(creds))
                .build();

        presigner = S3Presigner.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(creds))
                .build();
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String originalName = Optional.ofNullable(file.getOriginalFilename())
                .map(this::sanitizeFilename)
                .orElse("unknown");

        String key = folder + "/" + UUID.randomUUID() + "_" + originalName;

        PutObjectRequest putReq = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

        try (InputStream is = file.getInputStream()) {
            s3.putObject(putReq, RequestBody.fromInputStream(is, file.getSize()));
        }

        return key;
    }

    public String generatePresignedUrl(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(presignSeconds))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presigned = presigner.presignGetObject(presignRequest);
        return presigned.url().toString();
    }

    private String sanitizeFilename(String name) {
        return name.replaceAll("[^a-zA-Z0-9\\.\\-\\_]", "_");
    }
}
