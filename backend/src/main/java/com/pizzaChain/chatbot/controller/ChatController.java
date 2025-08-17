package com.pizzaChain.chatbot.controller;

import com.pizzaChain.chatbot.dto.ChatRequest;
import com.pizzaChain.chatbot.dto.ChatResponse;
import com.pizzaChain.chatbot.service.ChatService;
import com.pizzaChain.chatbot.service.FallbackChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;

    @Autowired
    private FallbackChatService fallbackChatService;

    @Value("${chatbot.use.fallback:false}")
    private boolean useFallbackOnly;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        logger.info("Received chat request: {}", request.message());

        try {
            if (request.message() == null || request.message().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ChatResponse("Please provide a message."));
            }

            ChatResponse response;

            // If fallback-only mode is enabled, skip OpenAI
            if (useFallbackOnly) {
                logger.info("Using fallback responses only");
                response = fallbackChatService.getFallbackResponse(request);
            } else {
                // Try OpenAI first, fallback if it fails
                response = chatService.getChatResponse(request, "gpt-3.5-turbo");

                // If OpenAI response indicates rate limiting or other API issues, use fallback
                if (response.reply().contains("Rate limit exceeded") ||
                        response.reply().contains("quota exceeded") ||
                        response.reply().contains("Authentication error") ||
                        response.reply().contains("Network error")) {

                    logger.warn("OpenAI API issue detected, using fallback response");
                    response = fallbackChatService.getFallbackResponse(request);

                    // Add a note that we're in fallback mode
                    String fallbackNote = "\n\n💡 *Note: I'm currently using simplified responses due to high demand. Full AI features will return shortly!*";
                    response = new ChatResponse(response.reply() + fallbackNote);
                }
            }

            logger.info("Returning response: {}", response.reply());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error processing chat request", e);

            // Use fallback for any unexpected errors
            ChatResponse fallbackResponse = fallbackChatService.getFallbackResponse(request);
            String errorNote = "\n\n⚠️ *Experiencing technical difficulties - using basic responses temporarily*";

            return ResponseEntity.ok(
                    new ChatResponse(fallbackResponse.reply() + errorNote)
            );
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Chat service is running");
    }

    @PostMapping("/fallback-only")
    public ResponseEntity<ChatResponse> fallbackOnly(@RequestBody ChatRequest request) {
        logger.info("Using fallback-only mode for: {}", request.message());
        ChatResponse response = fallbackChatService.getFallbackResponse(request);
        return ResponseEntity.ok(response);
    }
}