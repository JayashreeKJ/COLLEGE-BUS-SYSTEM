package com.smartbus.dto;

import com.smartbus.entity.Schedule;
import com.smartbus.enums.ScheduleStatus;
import java.time.LocalTime;

public class ScheduleDTO {
    private Long id;
    private Long routeId;
    private String routeName;
    private String routeCode;
    private Long busId;
    private String busNumber;
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private String operatingDays;
    private ScheduleStatus status;

    public ScheduleDTO() {
    }

    public ScheduleDTO(Long id, Long routeId, String routeName, String routeCode, Long busId, String busNumber, Long driverId, String driverName, String driverPhone, LocalTime departureTime, LocalTime arrivalTime, String operatingDays, ScheduleStatus status) {
        this.id = id;
        this.routeId = routeId;
        this.routeName = routeName;
        this.routeCode = routeCode;
        this.busId = busId;
        this.busNumber = busNumber;
        this.driverId = driverId;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.operatingDays = operatingDays;
        this.status = status;
    }

    public static ScheduleDTO fromEntity(Schedule schedule) {
        if (schedule == null) return null;
        return new ScheduleDTO(
            schedule.getId(),
            schedule.getRoute() != null ? schedule.getRoute().getId() : null,
            schedule.getRoute() != null ? schedule.getRoute().getRouteName() : null,
            schedule.getRoute() != null ? schedule.getRoute().getRouteCode() : null,
            schedule.getBus() != null ? schedule.getBus().getId() : null,
            schedule.getBus() != null ? schedule.getBus().getBusNumber() : null,
            schedule.getDriver() != null ? schedule.getDriver().getId() : null,
            (schedule.getDriver() != null && schedule.getDriver().getUser() != null) ? schedule.getDriver().getUser().getName() : null,
            (schedule.getDriver() != null && schedule.getDriver().getUser() != null) ? schedule.getDriver().getUser().getPhone() : null,
            schedule.getDepartureTime(),
            schedule.getArrivalTime(),
            schedule.getOperatingDays(),
            schedule.getStatus()
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

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getOperatingDays() {
        return operatingDays;
    }

    public void setOperatingDays(String operatingDays) {
        this.operatingDays = operatingDays;
    }

    public ScheduleStatus getStatus() {
        return status;
    }

    public void setStatus(ScheduleStatus status) {
        this.status = status;
    }
}
