package com.smartbus.dto;

import jakarta.validation.constraints.NotNull;

public class UpdatePickupStopRequest {

    @NotNull(message = "Stop ID is required")
    private Long stopId;

    public UpdatePickupStopRequest() {
    }

    public UpdatePickupStopRequest(Long stopId) {
        this.stopId = stopId;
    }

    public Long getStopId() {
        return stopId;
    }

    public void setStopId(Long stopId) {
        this.stopId = stopId;
    }
}
