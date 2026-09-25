package com.smartbus.dto;

import com.smartbus.entity.Driver;
import com.smartbus.enums.DriverStatus;
import java.time.LocalDate;

public class DriverDTO {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String licenseNumber;
    private LocalDate licenseExpiry;
    private String emergencyContact;
    private Integer experienceYears;
    private DriverStatus status;
    private BusDTO assignedBus;
    private RouteDTO assignedRoute;
    private ScheduleDTO assignedSchedule;
    private TripDTO currentTrip;

    public DriverDTO() {
    }

    public static DriverDTO fromEntity(Driver driver) {
        if (driver == null) return null;
        DriverDTO dto = new DriverDTO();
        dto.setId(driver.getId());
        if (driver.getUser() != null) {
            dto.setUserId(driver.getUser().getId());
            dto.setName(driver.getUser().getName());
            dto.setEmail(driver.getUser().getEmail());
            dto.setPhone(driver.getUser().getPhone());
        }
        dto.setLicenseNumber(driver.getLicenseNumber());
        dto.setLicenseExpiry(driver.getLicenseExpiry());
        dto.setEmergencyContact(driver.getEmergencyContact());
        dto.setExperienceYears(driver.getExperienceYears());
        dto.setStatus(driver.getStatus());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public LocalDate getLicenseExpiry() {
        return licenseExpiry;
    }

    public void setLicenseExpiry(LocalDate licenseExpiry) {
        this.licenseExpiry = licenseExpiry;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public DriverStatus getStatus() {
        return status;
    }

    public void setStatus(DriverStatus status) {
        this.status = status;
    }

    public BusDTO getAssignedBus() {
        return assignedBus;
    }

    public void setAssignedBus(BusDTO assignedBus) {
        this.assignedBus = assignedBus;
    }

    public RouteDTO getAssignedRoute() {
        return assignedRoute;
    }

    public void setAssignedRoute(RouteDTO assignedRoute) {
        this.assignedRoute = assignedRoute;
    }

    public ScheduleDTO getAssignedSchedule() {
        return assignedSchedule;
    }

    public void setAssignedSchedule(ScheduleDTO assignedSchedule) {
        this.assignedSchedule = assignedSchedule;
    }

    public TripDTO getCurrentTrip() {
        return currentTrip;
    }

    public void setCurrentTrip(TripDTO currentTrip) {
        this.currentTrip = currentTrip;
    }
}
