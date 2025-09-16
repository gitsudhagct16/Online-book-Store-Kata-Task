package com.example.bookstorebackend.dto;

public class AuthResponse {
    private String message;
    private Long userId;
    private String name;
    private String token;


    public AuthResponse() {
    }

    public AuthResponse(String message, Long userId, String name, String token) {
        this.message = message;
        this.userId = userId;
        this.name = name;
        this.token = token;
    }

    public AuthResponse(String message, Long userId ) {
        this.message = message;
        this.userId = userId;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


}
