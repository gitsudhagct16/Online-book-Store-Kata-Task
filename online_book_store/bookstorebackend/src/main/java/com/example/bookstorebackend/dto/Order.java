package com.example.bookstorebackend.dto;

public class Order {
    private long id;
    private int quantity;

    public Order() {

    }

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Order(int id, int quantity) {
        this.id = id;
        this.quantity = quantity;
    }
}
