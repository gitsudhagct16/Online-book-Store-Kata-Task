package com.example.bookstorebackend.controller;

import com.example.bookstorebackend.dto.AuthResponse;
import com.example.bookstorebackend.model.User;
import com.example.bookstorebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // ✅ 201 Created
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody User request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response); // ✅ 200 OK
    }
}
