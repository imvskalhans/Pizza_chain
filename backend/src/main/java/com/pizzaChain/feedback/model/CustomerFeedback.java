package com.pizzaChain.feedback.model;

import com.pizzaChain.customerProfile.model.Customer;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "customer_feedback") // use lowercase snake_case to avoid quoted identifiers
public class CustomerFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Customer customer;


    @Column(nullable = false, length = 1000)
    private String text;

    @Column(nullable = false)
    private LocalDate date;

    public CustomerFeedback() {}

    public CustomerFeedback(Customer customer, String text, LocalDate date) {
        this.customer = customer;
        this.text = text;
        this.date = date;
    }

    public UUID getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
