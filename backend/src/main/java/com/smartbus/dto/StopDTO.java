package com.smartbus.dto;

import com.smartbus.entity.Stop;
import java.math.BigDecimal;

public class StopDTO {
    private Long id;
    private String stopName;
    private String landmark;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public StopDTO() {
    }

    public StopDTO(Long id, String stopName, String landmark, BigDecimal latitude, BigDecimal longitude) {
        this.id = id;
        this.stopName = stopName;
        this.landmark = landmark;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static StopDTO fromEntity(Stop stop) {
        if (stop == null) return null;
        return new StopDTO(
            stop.getId(),
            stop.getStopName(),
            stop.getLandmark(),
            stop.getLatitude(),
            stop.getLongitude()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStopName() {
        return stopName;
    }

    public void setStopName(String stopName) {
        this.stopName = stopName;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
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
}
