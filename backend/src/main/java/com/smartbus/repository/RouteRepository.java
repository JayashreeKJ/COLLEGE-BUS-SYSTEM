package com.smartbus.repository;

import com.smartbus.entity.Route;
import com.smartbus.enums.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByRouteCode(String routeCode);
    List<Route> findByStatus(RouteStatus status);
}
