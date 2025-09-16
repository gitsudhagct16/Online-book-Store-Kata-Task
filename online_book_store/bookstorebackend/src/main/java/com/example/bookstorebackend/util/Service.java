package com.example.bookstorebackend.util;


import java.util.Base64;

public class Service {

    // Define a static key for XOR encryption/decryption
    private static final String SECRET_KEY = "MySecretKey123";

    // Encrypt the password using XOR + Base64
    public static String encode(String password) {
        byte[] passwordBytes = password.getBytes();
        byte[] keyBytes = SECRET_KEY.getBytes();
        byte[] encryptedBytes = new byte[passwordBytes.length];

        for (int i = 0; i < passwordBytes.length; i++) {
            encryptedBytes[i] = (byte) (passwordBytes[i] ^ keyBytes[i % keyBytes.length]);
        }

        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    // Decrypt the password using XOR + Base64
    public static String decode(String encodedPassword) {
        byte[] encryptedBytes = Base64.getDecoder().decode(encodedPassword);
        byte[] keyBytes = SECRET_KEY.getBytes();
        byte[] decryptedBytes = new byte[encryptedBytes.length];

        for (int i = 0; i < encryptedBytes.length; i++) {
            decryptedBytes[i] = (byte) (encryptedBytes[i] ^ keyBytes[i % keyBytes.length]);
        }

        return new String(decryptedBytes);
    }
}

