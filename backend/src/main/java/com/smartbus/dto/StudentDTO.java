package com.smartbus.dto;

import com.smartbus.entity.Student;

public class StudentDTO {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String rollNumber;
    private String branch;
    private Integer yearOfStudy;
    private Long pickupStopId;
    private String pickupStopName;
    private String emergencyContact;
    private RouteDTO assignedRoute;
    private ScheduleDTO assignedSchedule;
    private TripDTO activeTrip;

    public StudentDTO() {
    }

    public static StudentDTO fromEntity(Student student) {
        if (student == null) return null;
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        if (student.getUser() != null) {
            dto.setUserId(student.getUser().getId());
            dto.setName(student.getUser().getName());
            dto.setEmail(student.getUser().getEmail());
            dto.setPhone(student.getUser().getPhone());
        }
        dto.setRollNumber(student.getRollNumber());
        dto.setBranch(student.getBranch());
        dto.setYearOfStudy(student.getYearOfStudy());
        if (student.getPickupStop() != null) {
            dto.setPickupStopId(student.getPickupStop().getId());
            dto.setPickupStopName(student.getPickupStop().getStopName());
        }
        dto.setEmergencyContact(student.getEmergencyContact());
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

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public Long getPickupStopId() {
        return pickupStopId;
    }

    public void setPickupStopId(Long pickupStopId) {
        this.pickupStopId = pickupStopId;
    }

    public String getPickupStopName() {
        return pickupStopName;
    }

    public void setPickupStopName(String pickupStopName) {
        this.pickupStopName = pickupStopName;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
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

    public TripDTO getActiveTrip() {
        return activeTrip;
    }

    public void setActiveTrip(TripDTO activeTrip) {
        this.activeTrip = activeTrip;
    }
}
