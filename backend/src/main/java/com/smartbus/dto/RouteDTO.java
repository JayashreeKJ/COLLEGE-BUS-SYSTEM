package com.smartbus.dto;

import com.smartbus.entity.Route;
import com.smartbus.enums.RouteStatus;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class RouteDTO {
    private Long id;
    private String routeName;
    private String routeCode;
    private String startPoint;
    private String endPoint;
    private BigDecimal totalDistanceKm;
    private RouteStatus status;
    private List<RouteStopDTO> stops = new ArrayList<>();

    public RouteDTO() {
    }

    public RouteDTO(Long id, String routeName, String routeCode, String startPoint, String endPoint, BigDecimal totalDistanceKm, RouteStatus status, List<RouteStopDTO> stops) {
        this.id = id;
        this.routeName = routeName;
        this.routeCode = routeCode;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.totalDistanceKm = totalDistanceKm;
        this.status = status;
        if (stops != null) {
            this.stops = stops;
        }
    }

    public static RouteDTO fromEntity(Route route) {
        if (route == null) return null;
        return new RouteDTO(
            route.getId(),
            route.getRouteName(),
            route.getRouteCode(),
            route.getStartPoint(),
            route.getEndPoint(),
            route.getTotalDistanceKm(),
            route.getStatus(),
            new ArrayList<>()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getTotalDistanceKm() {
        return totalDistanceKm;
    }

    public void setTotalDistanceKm(BigDecimal totalDistanceKm) {
        this.totalDistanceKm = totalDistanceKm;
    }

    public RouteStatus getStatus() {
        return status;
    }

    public void setStatus(RouteStatus status) {
        this.status = status;
    }

    public List<RouteStopDTO> getStops() {
        return stops;
    }

    public void setStops(List<RouteStopDTO> stops) {
        this.stops = stops;
    }
}
