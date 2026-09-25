package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.StudentDTO;
import com.smartbus.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentDTO>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.ok("Students retrieved successfully", studentService.getAllStudents()));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentDTO>> getMyStudentProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        StudentDTO student = studentService.getStudentByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Student profile retrieved", student));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDTO>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Student retrieved successfully", studentService.getStudentById(id)));
    }

    @PutMapping("/me/pickup-stop")
    public ResponseEntity<ApiResponse<StudentDTO>> updatePickupStop(
            @AuthenticationPrincipal UserDetails userDetails,
            @jakarta.validation.Valid @RequestBody com.smartbus.dto.UpdatePickupStopRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        StudentDTO updatedStudent = studentService.updatePickupStop(userDetails.getUsername(), request.getStopId());
        return ResponseEntity.ok(ApiResponse.ok("Pickup stop updated successfully", updatedStudent));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<StudentDTO>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody com.smartbus.dto.UpdateStudentProfileRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        StudentDTO updatedStudent = studentService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Student profile updated successfully", updatedStudent));
    }
}
