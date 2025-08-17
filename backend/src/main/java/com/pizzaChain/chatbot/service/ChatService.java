package com.pizzaChain.chatbot.service;

import com.pizzaChain.chatbot.dto.ChatRequest;
import com.pizzaChain.chatbot.dto.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    // Simple rate limiting - track last request time per IP/session
    private final Map<String, LocalDateTime> lastRequestTimes = new ConcurrentHashMap<>();
    private final int MIN_SECONDS_BETWEEN_REQUESTS = 3; // 3 seconds between requests

    public ChatResponse getChatResponse(ChatRequest request, String model) {
        return getChatResponse(request, model, "default-user");
    }

    public ChatResponse getChatResponse(ChatRequest request, String model, String userId) {
        logger.info("Processing chat request from user {}: {}", userId, request.message());

        // Check rate limiting
        if (isRateLimited(userId)) {
            logger.warn("Rate limiting user {}", userId);
            return new ChatResponse("⏱️ Please wait a moment before sending another message.");
        }

        // Validate API key
        if (openaiApiKey == null || openaiApiKey.trim().isEmpty()) {
            logger.error("OpenAI API key is not configured");
            return new ChatResponse("⚠️ Configuration error: API key not set");
        }

        // Validate request
        if (request.message() == null || request.message().trim().isEmpty()) {
            logger.warn("Empty message received");
            return new ChatResponse("Please provide a message.");
        }

        // Update last request time
        lastRequestTimes.put(userId, LocalDateTime.now());

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey.trim());
            headers.set("User-Agent", "PizzaChain-Bot/1.0");

            Map<String, Object> body = new HashMap<>();
            body.put("model", model != null ? model : "gpt-3.5-turbo");
            body.put("messages", new Object[]{
                    Map.of("role", "system", "content",
                            "You are a helpful assistant for PizzaChain restaurant. " +
                                    "Help customers with menu questions, orders, and general inquiries. " +
                                    "Be friendly and concise. Keep responses under 100 words."),
                    Map.of("role", "user", "content", request.message().trim())
            });
            body.put("max_tokens", 100); // Reduced to save on token usage
            body.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            logger.info("Sending request to OpenAI API with model: {}", body.get("model"));

            ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, entity, Map.class);

            logger.info("OpenAI API response status: {}", response.getStatusCode());

            if (response.getBody() == null) {
                logger.error("Received null response body from OpenAI");
                return new ChatResponse("⚠️ Received empty response from AI service");
            }

            // Extract the reply safely
            try {
                @SuppressWarnings("unchecked")
                java.util.List<Map<String, Object>> choices =
                        (java.util.List<Map<String, Object>>) response.getBody().get("choices");

                if (choices == null || choices.isEmpty()) {
                    logger.error("No choices in OpenAI response");
                    return new ChatResponse("⚠️ Invalid response format from AI service");
                }

                @SuppressWarnings("unchecked")
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

                if (message == null) {
                    logger.error("No message in OpenAI choice");
                    return new ChatResponse("⚠️ Invalid message format from AI service");
                }

                String content = (String) message.get("content");

                if (content == null || content.trim().isEmpty()) {
                    logger.error("Empty content in OpenAI message");
                    return new ChatResponse("⚠️ Received empty response from AI service");
                }

                String reply = content.trim();
                logger.info("Successfully received reply from OpenAI: {}", reply);
                return new ChatResponse(reply);

            } catch (ClassCastException | NullPointerException e) {
                logger.error("Error parsing OpenAI response structure", e);
                return new ChatResponse("⚠️ Error parsing AI response");
            }

        } catch (RestClientException e) {
            logger.error("Network error calling OpenAI API", e);

            if (e.getMessage().contains("401")) {
                return new ChatResponse("⚠️ Authentication error: Please check your OpenAI account and API key");
            } else if (e.getMessage().contains("429")) {
                return new ChatResponse("⚠️ Rate limit exceeded. Please wait a few minutes and try again.");
            } else if (e.getMessage().contains("insufficient_quota")) {
                return new ChatResponse("⚠️ OpenAI quota exceeded. Please check your OpenAI billing.");
            } else if (e.getMessage().contains("timeout")) {
                return new ChatResponse("⚠️ Request timeout: Please try again");
            } else {
                return new ChatResponse("⚠️ Network error: Unable to connect to AI service");
            }

        } catch (Exception e) {
            logger.error("Unexpected error calling OpenAI API", e);
            return new ChatResponse("⚠️ Unexpected error occurred. Please try again later.");
        }
    }

    private boolean isRateLimited(String userId) {
        LocalDateTime lastRequest = lastRequestTimes.get(userId);
        if (lastRequest == null) {
            return false;
        }

        long secondsSinceLastRequest = ChronoUnit.SECONDS.between(lastRequest, LocalDateTime.now());
        return secondsSinceLastRequest < MIN_SECONDS_BETWEEN_REQUESTS;
    }

    // Method to clear old entries (call this periodically)
    public void cleanupOldEntries() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(1);
        lastRequestTimes.entrySet().removeIf(entry -> entry.getValue().isBefore(cutoff));
    }
}