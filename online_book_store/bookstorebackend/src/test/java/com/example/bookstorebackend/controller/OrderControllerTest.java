package com.example.bookstorebackend.controller;

import com.example.bookstorebackend.dto.Order;
import com.example.bookstorebackend.dto.OrderRequest;
import com.example.bookstorebackend.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false) // ✅ disables JwtAuthFilter
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrderService orderService; // ✅ correct annotation for Spring Boot 3.2+

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void placeOrder_shouldReturnSuccessMessage() throws Exception {
        // Arrange
        Order order = new Order();
        order.setId(1);
        order.setQuantity(2);

        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setCartItems(Collections.singletonList(order));

        doNothing().when(orderService).placeOrder(orderRequest.getCartItems());

        // Act & Assert
        mockMvc.perform(post("/api/cart/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("Order Placed"));
    }
}
