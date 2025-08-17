package com.pizzaChain.feedback.repository;

import com.pizzaChain.feedback.model.CustomerFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<CustomerFeedback, UUID> {

    // navigate relation: "customer.id" -> "customer_Id" in method name
    List<CustomerFeedback> findByCustomer_IdOrderByDateDesc(UUID customerId);
}
