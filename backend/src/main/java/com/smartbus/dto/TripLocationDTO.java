package com.smartbus.dto;

import com.smartbus.entity.TripLocation;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TripLocationDTO {
    private Long id;
    private Long tripId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal accuracy;
    private BigDecimal speed;
    private BigDecimal heading;
    private LocalDateTime recordedAt;

    public TripLocationDTO() {
    }

    public TripLocationDTO(Long id, Long tripId, BigDecimal latitude, BigDecimal longitude, BigDecimal accuracy, BigDecimal speed, BigDecimal heading, LocalDateTime recordedAt) {
        this.id = id;
        this.tripId = tripId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracy = accuracy;
        this.speed = speed;
        this.heading = heading;
        this.recordedAt = recordedAt;
    }

    public static TripLocationDTO fromEntity(TripLocation location) {
        if (location == null) return null;
        return new TripLocationDTO(
            location.getId(),
            location.getTrip() != null ? location.getTrip().getId() : null,
            location.getLatitude(),
            location.getLongitude(),
            location.getAccuracy(),
            location.getSpeed(),
            location.getHeading(),
            location.getRecordedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public BigDecimal getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(BigDecimal accuracy) {
        this.accuracy = accuracy;
    }

    public BigDecimal getSpeed() {
        return speed;
    }

    public void setSpeed(BigDecimal speed) {
        this.speed = speed;
    }

    public BigDecimal getHeading() {
        return heading;
    }

    public void setHeading(BigDecimal heading) {
        this.heading = heading;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
