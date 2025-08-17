package com.pizzaChain.feedback.controller;

import com.pizzaChain.feedback.dto.FeedbackDTO;
import com.pizzaChain.feedback.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * Get all feedback for a specific customer
     */
    @GetMapping("/{customerId}")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackForCustomer(@PathVariable UUID customerId) {
        return ResponseEntity.ok(feedbackService.getFeedbackForCustomer(customerId));
    }

    /**
     * Add new feedback for a customer
     */
    @PostMapping("/{customerId}")
    public ResponseEntity<FeedbackDTO> addFeedback(
            @PathVariable UUID customerId,
            @RequestParam String text
    ) {
        return ResponseEntity.ok(feedbackService.addFeedback(customerId, text));
    }

    /**
     * Update existing feedback by feedback ID
     */
    @PutMapping("/{feedbackId}")
    public ResponseEntity<FeedbackDTO> updateFeedback(
            @PathVariable UUID feedbackId,
            @RequestParam String text
    ) {
        return ResponseEntity.ok(feedbackService.updateFeedback(feedbackId, text));
    }

    /**
     * Partially update existing feedback by feedback ID
     */
    @PatchMapping("/{feedbackId}")
    public ResponseEntity<FeedbackDTO> patchFeedback(
            @PathVariable UUID feedbackId,
            @RequestParam String text
    ) {
        // For simplicity, PATCH does the same as PUT in this case
        // You could extend this to support partial updates if needed
        return ResponseEntity.ok(feedbackService.updateFeedback(feedbackId, text));
    }

    /**
     * Delete feedback by feedback ID
     */
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable UUID feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
        return ResponseEntity.noContent().build(); // Returns 204 No Content
    }
}