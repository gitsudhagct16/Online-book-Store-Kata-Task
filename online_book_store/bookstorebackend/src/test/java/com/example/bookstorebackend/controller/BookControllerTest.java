
package com.example.bookstorebackend.controller;

import com.example.bookstorebackend.model.Book;
import com.example.bookstorebackend.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookController.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookService bookService;

    @Test
    void getAllBooks_shouldReturnListOfBooks() throws Exception {
        Book book = new Book(1L, "Spring Boot", "Sudha", 499.0, "image.jpg", 10);
        when(bookService.getAllBooks()).thenReturn(List.of(book));

        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Spring Boot"))
                .andExpect(jsonPath("$[0].author").value("Sudha"))
                .andExpect(jsonPath("$[0].price").value(499.0));
    }
}
