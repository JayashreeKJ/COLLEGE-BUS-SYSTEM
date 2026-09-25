package com.smartbus.service;

import com.smartbus.dto.BusDTO;
import com.smartbus.entity.Bus;
import com.smartbus.exception.ResourceNotFoundException;
import com.smartbus.repository.BusRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @Transactional(readOnly = true)
    public List<BusDTO> getAllBuses() {
        return busRepository.findAll().stream()
                .map(BusDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BusDTO getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "id", id));
        return BusDTO.fromEntity(bus);
    }
}
