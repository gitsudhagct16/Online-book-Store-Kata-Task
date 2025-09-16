package com.example.bookstorebackend.util;


import java.util.Base64;

public class JwtUtil {

    private static final String SECRET_KEY = "MyJwtSecretKey";

    // Generate token with 1-minute expiry
    public static String generateToken(String email) {
        long currentTimeMillis = System.currentTimeMillis();
        long expiryTimeMillis = currentTimeMillis + 100_00;

        String payload = email + ":" + expiryTimeMillis;
        String token = Base64.getEncoder().encodeToString((payload + ":" + SECRET_KEY).getBytes());

        return token;
    }

    // Validate if token is expired
    public static boolean isTokenExpired(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            long expiry = Long.parseLong(parts[1]);
            return expiry < System.currentTimeMillis();
        } catch (Exception e) {
            return true; // treat as expired if format is invalid
        }
    }

    // Extract email from token
    public static String extractEmailFromToken(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            return parts[0]; // email is the first part
        } catch (Exception e) {
            throw new RuntimeException("Invalid token format");
        }
    }

    // Refresh token if expired
    public static String refreshTokenIfExpired(String token) {
        if (isTokenExpired(token)) {
            String email = extractEmailFromToken(token);
            return generateToken(email);
        }
        return token; // still valid
    }
}
