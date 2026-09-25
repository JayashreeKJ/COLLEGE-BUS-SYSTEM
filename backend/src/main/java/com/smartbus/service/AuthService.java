package com.smartbus.service;
import com.smartbus.dto.RegisterRequest;
import com.smartbus.enums.Role;
import com.smartbus.enums.UserStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.smartbus.dto.AuthResponse;
import com.smartbus.dto.LoginRequest;
import com.smartbus.dto.UserDTO;
import com.smartbus.entity.User;
import com.smartbus.exception.ResourceNotFoundException;
import com.smartbus.repository.UserRepository;
import com.smartbus.security.JwtUtils;
import com.smartbus.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

public AuthService(
        AuthenticationManager authenticationManager,
        UserRepository userRepository,
        JwtUtils jwtUtils,
        PasswordEncoder passwordEncoder) {

    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
    this.jwtUtils = jwtUtils;
    this.passwordEncoder = passwordEncoder;
}

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // Verify that the user role matches the selected role
        if (userPrincipal.getRole() != loginRequest.getRole()) {
            throw new BadCredentialsException("Account role mismatch. This account is registered as " 
                    + userPrincipal.getRole() + ", not " + loginRequest.getRole());
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(userPrincipal);

        User user = userRepository.findByEmail(userPrincipal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userPrincipal.getUsername()));

        return new AuthResponse(jwt, UserDTO.fromEntity(user));
    }
    @Transactional
    public UserDTO register(RegisterRequest registerRequest) {

        String email = registerRequest.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadCredentialsException("An account with this email already exists");
        }

        User user = new User();

        user.setName(registerRequest.getName().trim());
        user.setEmail(email);

        // Hash the password using BCrypt
        user.setPasswordHash(
                passwordEncoder.encode(registerRequest.getPassword())
        );

        // Public signup creates a Student account
        user.setRole(Role.ROLE_STUDENT);

        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        return UserDTO.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return UserDTO.fromEntity(user);
    }
}
