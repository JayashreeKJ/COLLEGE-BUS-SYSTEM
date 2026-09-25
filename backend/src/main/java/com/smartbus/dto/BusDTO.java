package com.smartbus.dto;

import com.smartbus.entity.Bus;
import com.smartbus.enums.BusStatus;

public class BusDTO {
    private Long id;
    private String busNumber;
    private String registrationNumber;
    private Integer capacity;
    private String model;
    private BusStatus status;

    public BusDTO() {
    }

    public BusDTO(Long id, String busNumber, String registrationNumber, Integer capacity, String model, BusStatus status) {
        this.id = id;
        this.busNumber = busNumber;
        this.registrationNumber = registrationNumber;
        this.capacity = capacity;
        this.model = model;
        this.status = status;
    }

    public static BusDTO fromEntity(Bus bus) {
        if (bus == null) return null;
        return new BusDTO(
            bus.getId(),
            bus.getBusNumber(),
            bus.getRegistrationNumber(),
            bus.getCapacity(),
            bus.getModel(),
            bus.getStatus()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public BusStatus getStatus() {
        return status;
    }

    public void setStatus(BusStatus status) {
        this.status = status;
    }
}
