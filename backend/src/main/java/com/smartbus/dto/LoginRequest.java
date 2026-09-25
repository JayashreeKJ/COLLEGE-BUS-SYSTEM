package com.smartbus.dto;

import com.smartbus.enums.Role;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    public LoginRequest() {
    }

    public LoginRequest(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    @JsonSetter("role")
    public void setRole(Object roleValue) {
        if (roleValue == null) return;
        String val = roleValue.toString().toUpperCase().trim();
        if (!val.startsWith("ROLE_")) {
            val = "ROLE_" + val;
        }
        try {
            this.role = Role.valueOf(val);
        } catch (IllegalArgumentException e) {
            this.role = null;
        }
    }
}
