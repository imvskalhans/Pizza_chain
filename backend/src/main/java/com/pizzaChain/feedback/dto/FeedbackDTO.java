package com.pizzaChain.feedback.dto;

import java.time.LocalDate;
import java.util.UUID;

public class FeedbackDTO {
    private UUID id;
    private String text;
    private LocalDate date;

    public FeedbackDTO() {}

    public FeedbackDTO(UUID id, String text, LocalDate date) {
        this.id = id;
        this.text = text;
        this.date = date;
    }

    public UUID getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public LocalDate getDate() {
        return date;
    }
}
