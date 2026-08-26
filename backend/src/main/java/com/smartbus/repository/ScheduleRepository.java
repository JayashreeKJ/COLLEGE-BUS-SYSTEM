package com.smartbus.repository;

import com.smartbus.entity.Schedule;
import com.smartbus.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByRouteId(Long routeId);
    List<Schedule> findByBusId(Long busId);
    List<Schedule> findByDriverId(Long driverId);
    List<Schedule> findByStatus(ScheduleStatus status);
}
