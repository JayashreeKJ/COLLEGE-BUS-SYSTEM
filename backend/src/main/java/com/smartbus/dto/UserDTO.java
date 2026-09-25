package com.smartbus.dto;

import com.smartbus.entity.User;
import com.smartbus.enums.Role;
import com.smartbus.enums.UserStatus;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private UserStatus status;

    public UserDTO() {
    }

    public UserDTO(Long id, String name, String email, Role role, String phone, UserStatus status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.status = status;
    }

    public static UserDTO fromEntity(User user) {
        if (user == null) return null;
        return new UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getPhone(),
            user.getStatus()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
