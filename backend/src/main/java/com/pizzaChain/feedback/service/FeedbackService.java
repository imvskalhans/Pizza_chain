package com.pizzaChain.feedback.service;

import com.pizzaChain.customerProfile.model.Customer;
import com.pizzaChain.feedback.dto.FeedbackDTO;
import com.pizzaChain.feedback.model.CustomerFeedback;
import com.pizzaChain.customerProfile.repository.CustomerRepository;
import com.pizzaChain.feedback.repository.FeedbackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private static final Logger log = LoggerFactory.getLogger(FeedbackService.class);

    private final FeedbackRepository feedbackRepository;
    private final CustomerRepository customerRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, CustomerRepository customerRepository) {
        this.feedbackRepository = feedbackRepository;
        this.customerRepository = customerRepository;
    }

    /**
     * Get all feedback for a customer
     */
    public List<FeedbackDTO> getFeedbackForCustomer(UUID customerId) {
        log.info("Fetching feedback for customer {}", customerId);
        List<FeedbackDTO> feedbacks = feedbackRepository
                .findByCustomer_IdOrderByDateDesc(customerId)
                .stream()
                .map(f -> new FeedbackDTO(f.getId(), f.getText(), f.getDate()))
                .collect(Collectors.toList());
        log.info("Found {} feedback entries for customer {}", feedbacks.size(), customerId);
        return feedbacks;
    }

    /**
     * Add new feedback for a customer
     */
    public FeedbackDTO addFeedback(UUID customerId, String text) {
        log.info("Adding feedback for customer {}: {}", customerId, text);
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    log.error("Customer not found: {}", customerId);
                    return new IllegalArgumentException("Customer not found: " + customerId);
                });

        CustomerFeedback feedback = new CustomerFeedback(customer, text, LocalDate.now());
        CustomerFeedback saved = feedbackRepository.save(feedback);

        log.info("Feedback saved with ID {}", saved.getId());
        return new FeedbackDTO(saved.getId(), saved.getText(), saved.getDate());
    }

    /**
     * Update existing feedback
     */
    public FeedbackDTO updateFeedback(UUID feedbackId, String newText) {
        log.info("Updating feedback {}: {}", feedbackId, newText);

        CustomerFeedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> {
                    log.error("Feedback not found: {}", feedbackId);
                    return new IllegalArgumentException("Feedback not found: " + feedbackId);
                });

        feedback.setText(newText);
        // Optionally update the date to show when it was last modified
        // feedback.setDate(LocalDate.now());

        CustomerFeedback updated = feedbackRepository.save(feedback);

        log.info("Feedback {} updated successfully", feedbackId);
        return new FeedbackDTO(updated.getId(), updated.getText(), updated.getDate());
    }

    /**
     * Delete feedback by ID
     */
    public void deleteFeedback(UUID feedbackId) {
        log.info("Deleting feedback {}", feedbackId);

        if (!feedbackRepository.existsById(feedbackId)) {
            log.error("Feedback not found: {}", feedbackId);
            throw new IllegalArgumentException("Feedback not found: " + feedbackId);
        }

        feedbackRepository.deleteById(feedbackId);
        log.info("Feedback {} deleted successfully", feedbackId);
    }
}