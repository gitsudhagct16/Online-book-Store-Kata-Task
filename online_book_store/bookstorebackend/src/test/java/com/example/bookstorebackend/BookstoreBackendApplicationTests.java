package com.example.bookstorebackend;

import com.example.bookstorebackend.controller.UserController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class BookstoreBackendApplicationTests {

    @Autowired
    private UserController userController;

    @Test
    void userControllerShouldBeLoaded() {
        assertNotNull(userController); // ✅ Ensures bean is present
    }
}

