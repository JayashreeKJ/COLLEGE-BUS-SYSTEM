package com.smartbus.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "route_stops",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_route_sequence", columnNames = {"route_id", "stop_sequence"}),
        @UniqueConstraint(name = "uk_route_stop", columnNames = {"route_id", "stop_id"})
    }
)
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id", nullable = false)
    private Stop stop;

    @Column(name = "stop_sequence", nullable = false)
    private Integer stopSequence;

    @Column(name = "estimated_arrival_offset_minutes")
    private Integer estimatedArrivalOffsetMinutes;

    @Column(name = "distance_from_prev_stop_km", precision = 5, scale = 2)
    private BigDecimal distanceFromPrevStopKm;

    public RouteStop() {
    }

    public RouteStop(Route route, Stop stop, Integer stopSequence, Integer estimatedArrivalOffsetMinutes, BigDecimal distanceFromPrevStopKm) {
        this.route = route;
        this.stop = stop;
        this.stopSequence = stopSequence;
        this.estimatedArrivalOffsetMinutes = estimatedArrivalOffsetMinutes;
        this.distanceFromPrevStopKm = distanceFromPrevStopKm;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public Stop getStop() {
        return stop;
    }

    public void setStop(Stop stop) {
        this.stop = stop;
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
