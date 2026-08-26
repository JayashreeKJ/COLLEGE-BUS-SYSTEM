package com.smartbus.dto;

import java.time.LocalDateTime;

public class HealthResponse {
    private String status;
    private String message;
    private String version;
    private String environment;
    private LocalDateTime timestamp;

    public HealthResponse() {
    }

    public HealthResponse(String status, String message, String version, String environment) {
        this.status = status;
        this.message = message;
        this.version = version;
        this.environment = environment;
        this.timestamp = LocalDateTime.now();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
