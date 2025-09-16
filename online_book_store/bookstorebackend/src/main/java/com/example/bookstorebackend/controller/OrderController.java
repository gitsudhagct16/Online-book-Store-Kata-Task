package com.example.bookstorebackend.controller;

import com.example.bookstorebackend.dto.Order;
import com.example.bookstorebackend.dto.OrderRequest;
import com.example.bookstorebackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class OrderController {


    @Autowired
    private OrderService orderService;


    @PostMapping("/order")
    public ResponseEntity<String> placeOrder(@RequestBody OrderRequest orderRequest) {
// function to place order
        List<Order> cartItems = orderRequest.getCartItems();
        orderService.placeOrder(cartItems); // Update service method accordingly
        return ResponseEntity.ok("Order Placed");
    }

}





