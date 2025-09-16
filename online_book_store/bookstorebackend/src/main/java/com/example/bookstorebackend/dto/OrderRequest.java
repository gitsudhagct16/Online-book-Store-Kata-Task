package com.example.bookstorebackend.dto;


import java.util.List;

public class OrderRequest {
    private List<Order> cartItems;

    // Constructors
    public OrderRequest() {}

    public OrderRequest(List<Order> cartItems) {
        this.cartItems = cartItems;
    }

    // Getters and Setters
    public List<Order> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<Order> cartItems) {
        this.cartItems = cartItems;
    }
}
