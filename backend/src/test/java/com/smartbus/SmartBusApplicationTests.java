package com.smartbus;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
class SmartBusApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @Test
    void healthEndpointReturnsOk() throws Exception {
        mockMvc.perform(get("/api/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.message").value("SmartBus Backend API is running successfully"));
    }

    @Test
    void adminEndpointUnauthenticatedReturns401() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void adminEndpointWithStudentRoleReturns403() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "driver@college.edu", roles = {"DRIVER"})
    void adminEndpointWithDriverRoleReturns403() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@college.edu", roles = {"ADMIN"})
    void adminEndpointWithAdminRoleReturnsOk() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalDrivers").isNumber());
    }

    @Test
    @WithMockUser(username = "admin@college.edu", roles = {"ADMIN"})
    void adminCanUpdateDriverProfile() throws Exception {
        String updatePayload = "{\"name\":\"Updated Driver Name\",\"photoUrl\":\"/uploads/drivers/custom.png\"}";

        mockMvc.perform(put("/api/admin/drivers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Updated Driver Name"))
                .andExpect(jsonPath("$.data.photoUrl").value("/uploads/drivers/custom.png"));
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCannotUpdateDriverProfile() throws Exception {
        String updatePayload = "{\"name\":\"Hacked Name\"}";

        mockMvc.perform(put("/api/admin/drivers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatePayload))
                .andExpect(status().isForbidden());
    }

    // ==========================================
    // Role-Based Authorization & IDOR Tests
    // ==========================================

    @Test
    void unauthenticatedAccessToStudentsMeReturns401() throws Exception {
        mockMvc.perform(get("/api/students/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void unauthenticatedAccessToDriversMeReturns401() throws Exception {
        mockMvc.perform(get("/api/drivers/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCannotListAllStudents() throws Exception {
        mockMvc.perform(get("/api/students")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCannotAccessArbitraryStudentById() throws Exception {
        mockMvc.perform(get("/api/students/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "driver@college.edu", roles = {"DRIVER"})
    void driverCannotListAllStudents() throws Exception {
        mockMvc.perform(get("/api/students")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "driver@college.edu", roles = {"DRIVER"})
    void driverCannotAccessStudentMe() throws Exception {
        mockMvc.perform(get("/api/students/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCannotListAllDrivers() throws Exception {
        mockMvc.perform(get("/api/drivers")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCannotAccessArbitraryDriverById() throws Exception {
        mockMvc.perform(get("/api/drivers/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCannotAccessDriverMe() throws Exception {
        mockMvc.perform(get("/api/drivers/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCannotStartTrip() throws Exception {
        mockMvc.perform(post("/api/trips/1/start")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCanAccessOwnProfileMe() throws Exception {
        mockMvc.perform(get("/api/students/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "student@college.edu", roles = {"STUDENT"})
    void studentCanViewActiveTripsForTracking() throws Exception {
        mockMvc.perform(get("/api/trips/active")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "driver@college.edu", roles = {"DRIVER"})
    void driverCanAccessOwnProfileMe() throws Exception {
        mockMvc.perform(get("/api/drivers/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "admin@college.edu", roles = {"ADMIN"})
    void adminCanListAllStudents() throws Exception {
        mockMvc.perform(get("/api/students")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "admin@college.edu", roles = {"ADMIN"})
    void adminCanListAllDrivers() throws Exception {
        mockMvc.perform(get("/api/drivers")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
