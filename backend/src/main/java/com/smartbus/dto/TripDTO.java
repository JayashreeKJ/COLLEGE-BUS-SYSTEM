package com.smartbus.dto;

import com.smartbus.entity.Trip;
import com.smartbus.enums.TripStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TripDTO {
    private Long id;
    private Long scheduleId;
    private Long busId;
    private String busNumber;
    private String registrationNumber;
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private Long routeId;
    private String routeName;
    private String routeCode;
    private String startPoint;
    private String endPoint;
    private LocalDate tripDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private TripStatus status;
    private String notes;
    private TripLocationDTO latestLocation;

    public TripDTO() {
    }

    public static TripDTO fromEntity(Trip trip) {
        if (trip == null) return null;
        TripDTO dto = new TripDTO();
        dto.setId(trip.getId());
        dto.setScheduleId(trip.getSchedule() != null ? trip.getSchedule().getId() : null);
        
        if (trip.getBus() != null) {
            dto.setBusId(trip.getBus().getId());
            dto.setBusNumber(trip.getBus().getBusNumber());
            dto.setRegistrationNumber(trip.getBus().getRegistrationNumber());
        }

        if (trip.getDriver() != null) {
            dto.setDriverId(trip.getDriver().getId());
            if (trip.getDriver().getUser() != null) {
                dto.setDriverName(trip.getDriver().getUser().getName());
                dto.setDriverPhone(trip.getDriver().getUser().getPhone());
            }
        }

        if (trip.getRoute() != null) {
            dto.setRouteId(trip.getRoute().getId());
            dto.setRouteName(trip.getRoute().getRouteName());
            dto.setRouteCode(trip.getRoute().getRouteCode());
            dto.setStartPoint(trip.getRoute().getStartPoint());
            dto.setEndPoint(trip.getRoute().getEndPoint());
        }

        dto.setTripDate(trip.getTripDate());
        dto.setStartTime(trip.getStartTime());
        dto.setEndTime(trip.getEndTime());
        dto.setStatus(trip.getStatus());
        dto.setNotes(trip.getNotes());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverPhone() {
        return driverPhone;
    }

    public void setDriverPhone(String driverPhone) {
        this.driverPhone = driverPhone;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getRouteCode() {
        return routeCode;
    }

    public void setRouteCode(String routeCode) {
        this.routeCode = routeCode;
    }

    public String getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(String startPoint) {
        this.startPoint = startPoint;
    }

    public String getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(String endPoint) {
        this.endPoint = endPoint;
    }

    public LocalDate getTripDate() {
        return tripDate;
    }

    public void setTripDate(LocalDate tripDate) {
        this.tripDate = tripDate;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public TripLocationDTO getLatestLocation() {
        return latestLocation;
    }

    public void setLatestLocation(TripLocationDTO latestLocation) {
        this.latestLocation = latestLocation;
    }
}
