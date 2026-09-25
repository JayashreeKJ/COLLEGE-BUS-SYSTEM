package com.smartbus.dto;

import com.smartbus.entity.RouteStop;
import java.math.BigDecimal;

public class RouteStopDTO {
    private Long id;
    private Long routeId;
    private Long stopId;
    private String stopName;
    private String landmark;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer stopSequence;
    private Integer estimatedArrivalOffsetMinutes;
    private BigDecimal distanceFromPrevStopKm;

    public RouteStopDTO() {
    }

    public RouteStopDTO(Long id, Long routeId, Long stopId, String stopName, String landmark, BigDecimal latitude, BigDecimal longitude, Integer stopSequence, Integer estimatedArrivalOffsetMinutes, BigDecimal distanceFromPrevStopKm) {
        this.id = id;
        this.routeId = routeId;
        this.stopId = stopId;
        this.stopName = stopName;
        this.landmark = landmark;
        this.latitude = latitude;
        this.longitude = longitude;
        this.stopSequence = stopSequence;
        this.estimatedArrivalOffsetMinutes = estimatedArrivalOffsetMinutes;
        this.distanceFromPrevStopKm = distanceFromPrevStopKm;
    }

    public static RouteStopDTO fromEntity(RouteStop routeStop) {
        if (routeStop == null) return null;
        return new RouteStopDTO(
            routeStop.getId(),
            routeStop.getRoute() != null ? routeStop.getRoute().getId() : null,
            routeStop.getStop() != null ? routeStop.getStop().getId() : null,
            routeStop.getStop() != null ? routeStop.getStop().getStopName() : null,
            routeStop.getStop() != null ? routeStop.getStop().getLandmark() : null,
            routeStop.getStop() != null ? routeStop.getStop().getLatitude() : null,
            routeStop.getStop() != null ? routeStop.getStop().getLongitude() : null,
            routeStop.getStopSequence(),
            routeStop.getEstimatedArrivalOffsetMinutes(),
            routeStop.getDistanceFromPrevStopKm()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public Long getStopId() {
        return stopId;
    }

    public void setStopId(Long stopId) {
        this.stopId = stopId;
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

    public Integer getStopSequence() {
        return stopSequence;
    }

    public void setStopSequence(Integer stopSequence) {
        this.stopSequence = stopSequence;
    }

    public Integer getEstimatedArrivalOffsetMinutes() {
        return estimatedArrivalOffsetMinutes;
    }

    public void setEstimatedArrivalOffsetMinutes(Integer estimatedArrivalOffsetMinutes) {
        this.estimatedArrivalOffsetMinutes = estimatedArrivalOffsetMinutes;
    }

    public BigDecimal getDistanceFromPrevStopKm() {
        return distanceFromPrevStopKm;
    }

    public void setDistanceFromPrevStopKm(BigDecimal distanceFromPrevStopKm) {
        this.distanceFromPrevStopKm = distanceFromPrevStopKm;
    }
}
