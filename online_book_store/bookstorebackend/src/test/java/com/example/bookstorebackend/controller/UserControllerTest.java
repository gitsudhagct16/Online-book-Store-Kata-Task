package com.example.bookstorebackend.controller;

import com.example.bookstorebackend.dto.AuthResponse;
import com.example.bookstorebackend.model.User;
import com.example.bookstorebackend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_shouldReturnAuthResponse() throws Exception {
        User user = new User();
        user.setEmail("sudha@example.com");
        user.setName("Sudha");
       user.setPassword("password123");

        AuthResponse response = new AuthResponse("User registered successfully", 1L);

        when(authService.register(any(User.class))).thenReturn(response);

        mockMvc.perform(post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    void login_shouldReturnAuthResponseWithToken() throws Exception {
        User user = new User();
        user.setEmail("sudha@example.com");
        user.setPassword("password123");

        AuthResponse response = new AuthResponse("Login successful", 1L, "Sudha", "mocked-jwt-token");

        when(authService.login(any(User.class))).thenReturn(response);

        mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.name").value("Sudha"))
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"));
    }
}
