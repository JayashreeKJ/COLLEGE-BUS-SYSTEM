package com.smartbus.controller;

import com.smartbus.dto.RegisterRequest;
import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.AuthResponse;
import com.smartbus.dto.LoginRequest;
import com.smartbus.dto.UserDTO;
import com.smartbus.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.ok("Authentication successful", authResponse));
    }

@PostMapping("/register")
public ResponseEntity<ApiResponse<UserDTO>> register(
        @Valid @RequestBody RegisterRequest registerRequest) {

    UserDTO userDTO = authService.register(registerRequest);

    return ResponseEntity.ok(
            ApiResponse.ok("Registration successful", userDTO)
    );
}

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        UserDTO userDTO = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved", userDTO));
    }
}
