package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.DriverDTO;
import com.smartbus.dto.UpdateDriverRequest;
import com.smartbus.enums.TripStatus;
import com.smartbus.repository.*;
import com.smartbus.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final StudentRepository studentRepository;
    private final TripRepository tripRepository;
    private final DriverService driverService;

    public AdminController(BusRepository busRepository, DriverRepository driverRepository,
                           RouteRepository routeRepository, StopRepository stopRepository,
                           StudentRepository studentRepository, TripRepository tripRepository,
                           DriverService driverService) {
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.studentRepository = studentRepository;
        this.tripRepository = tripRepository;
        this.driverService = driverService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBuses", busRepository.count());
        stats.put("totalDrivers", driverRepository.count());
        stats.put("totalRoutes", routeRepository.count());
        stats.put("totalStops", stopRepository.count());
        stats.put("totalStudents", studentRepository.count());
        stats.put("activeTrips", tripRepository.findByStatus(TripStatus.IN_PROGRESS).size());
        stats.put("totalTrips", tripRepository.count());

        return ResponseEntity.ok(ApiResponse.ok("Admin stats retrieved", stats));
    }

    @PutMapping("/drivers/{id}")
    public ResponseEntity<ApiResponse<DriverDTO>> updateDriver(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDriverRequest request) {
        DriverDTO updated = driverService.updateDriverProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Driver profile updated successfully", updated));
    }

    @PostMapping(value = "/drivers/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DriverDTO>> uploadDriverPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Please select an image file to upload"));
        }

        // Validate file size: 5MB max
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File size exceeds 5MB limit"));
        }

        // Validate content type & format (JPEG, PNG, WebP)
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        boolean isValidType = (contentType != null && (contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/webp")))
                || extension.equals(".jpg") || extension.equals(".jpeg") || extension.equals(".png") || extension.equals(".webp");

        if (!isValidType) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid image format. Allowed formats: JPEG, PNG, WebP"));
        }

        if (extension.isEmpty()) {
            if ("image/png".equals(contentType)) extension = ".png";
            else if ("image/webp".equals(contentType)) extension = ".webp";
            else extension = ".jpg";
        }

        try {
            Path uploadDir = Paths.get("uploads", "drivers");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Isolated per-driver filename with timestamp to prevent caching issues and cross-driver overwrites
            String filename = "driver-" + id + "-" + System.currentTimeMillis() + extension;
            Path destination = uploadDir.resolve(filename);

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String photoUrl = "/uploads/drivers/" + filename;
            UpdateDriverRequest updateRequest = new UpdateDriverRequest();
            updateRequest.setPhotoUrl(photoUrl);

            DriverDTO updated = driverService.updateDriverProfile(id, updateRequest);
            return ResponseEntity.ok(ApiResponse.ok("Driver photo uploaded successfully", updated));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to save image file: " + e.getMessage()));
        }
    }
}

