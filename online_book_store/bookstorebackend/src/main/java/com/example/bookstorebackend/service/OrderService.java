package com.example.bookstorebackend.service;
import com.example.bookstorebackend.dto.Order;
import com.example.bookstorebackend.model.Book;
import com.example.bookstorebackend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class OrderService {
    @Autowired

    private BookRepository bookRepository;

    public void placeOrder(List<Order> orderList) {
        for (Order order : orderList) {
            Optional<Book> databaseBook = bookRepository.findById(order.getId());

            if (databaseBook.isPresent()) {
                Book book = databaseBook.get();

                int orderedQuantity = order.getQuantity();
                int availableQuantity = book.getStockQuantity();

                if (availableQuantity >= orderedQuantity) {
                    book.setStockQuantity(availableQuantity - orderedQuantity);
                    bookRepository.save(book); // persist the updated quantity
                } else {
                    // Handle insufficient stock
                    throw new RuntimeException("Not enough stock for book: " + book.getTitle());
                }
            } else {
                // Handle book not found
                throw new RuntimeException("Book not found with ID: " + order.getId());
            }
        }
    }


}
