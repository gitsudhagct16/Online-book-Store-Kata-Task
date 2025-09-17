package com.example.bookstorebackend.service;

import com.example.bookstorebackend.dto.AuthResponse;
import com.example.bookstorebackend.model.User;
import com.example.bookstorebackend.repository.UserRepository;
import com.example.bookstorebackend.util.JwtUtil;
import com.example.bookstorebackend.util.Service;
import org.springframework.beans.factory.annotation.Autowired;

@org.springframework.stereotype.Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(User request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Encrypt the password before saving

        String encodedPassword = Service.encode(request.getPassword());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        return new AuthResponse("User registered successfully", user.getId());
    }

    public AuthResponse login(User request) {
        System.out.println(request.toString());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        // Decode and compare the password
        System.out.println("user" + user.toString());
        String decodedPassword = Service.decode(user.getPassword());
        if (!decodedPassword.equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = JwtUtil.generateToken(request.getEmail());

        return new AuthResponse("Login successful", user.getId(), user.getName(), token);
    }
}
