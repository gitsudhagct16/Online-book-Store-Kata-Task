package com.example.bookstorebackend.controller;

import com.example.bookstorebackend.dto.AuthResponse;
import com.example.bookstorebackend.model.User;
import com.example.bookstorebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody User request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody User request) {
        return authService.login(request);
    }

}
