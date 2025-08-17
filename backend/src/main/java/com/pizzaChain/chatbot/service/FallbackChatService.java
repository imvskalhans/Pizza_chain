package com.pizzaChain.chatbot.service;

import com.pizzaChain.chatbot.dto.ChatRequest;
import com.pizzaChain.chatbot.dto.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class FallbackChatService {

    private static final Logger logger = LoggerFactory.getLogger(FallbackChatService.class);
    private final Random random = new Random();

    // Predefined responses when OpenAI is unavailable
    private final List<String> greetingResponses = Arrays.asList(
            "Hello! Welcome to PizzaChain! 🍕 How can I help you today?",
            "Hi there! I'm here to help with your pizza needs! What can I do for you?",
            "Welcome to PizzaChain! Ready to order some delicious pizza? 🍕"
    );

    private final List<String> menuResponses = Arrays.asList(
            "We have delicious pizzas including Margherita, Pepperoni, Hawaiian, and Meat Lovers! What sounds good to you? 🍕",
            "Our popular pizzas include classic Margherita, spicy Pepperoni, tropical Hawaiian, and hearty Meat Lovers. Which would you like to know more about?",
            "Check out our amazing pizza selection: Margherita, Pepperoni, Hawaiian, and Meat Lovers! All made fresh daily! 🍕"
    );

    private final List<String> orderResponses = Arrays.asList(
            "I'd love to help you place an order! What size pizza would you like, and which toppings? 🍕",
            "Great choice! Let's get your order started. What pizza and size would you prefer?",
            "Perfect! What pizza can I add to your order today? We have small, medium, and large sizes available! 🍕"
    );

    private final List<String> defaultResponses = Arrays.asList(
            "Thanks for your message! I'm here to help with your PizzaChain questions. Feel free to ask about our menu, orders, or anything else! 🍕",
            "I'm here to help with your PizzaChain needs! What would you like to know about our delicious pizzas?",
            "Thank you for contacting PizzaChain! How can I assist you with your pizza order today? 🍕"
    );

    public ChatResponse getFallbackResponse(ChatRequest request) {
        String message = request.message().toLowerCase().trim();
        logger.info("Generating fallback response for: {}", message);

        // Simple keyword matching for basic responses
        if (containsAny(message, "hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening")) {
            return new ChatResponse(getRandomResponse(greetingResponses));
        }

        if (containsAny(message, "menu", "pizza", "pizzas", "what do you have", "options", "choices")) {
            return new ChatResponse(getRandomResponse(menuResponses));
        }

        if (containsAny(message, "order", "buy", "purchase", "want", "get", "take")) {
            return new ChatResponse(getRandomResponse(orderResponses));
        }

        if (containsAny(message, "price", "cost", "how much", "pricing")) {
            return new ChatResponse("Our pizzas start at $12 for small, $16 for medium, and $20 for large. Prices may vary by toppings. What size were you thinking? 🍕");
        }

        if (containsAny(message, "delivery", "pickup", "location", "address")) {
            return new ChatResponse("We offer both delivery and pickup! We're located downtown and deliver within 5 miles. What's your preference? 🚚🍕");
        }

        if (containsAny(message, "hours", "open", "close", "time")) {
            return new ChatResponse("We're open Monday-Sunday 11 AM to 11 PM! Perfect time for fresh pizza! 🍕⏰");
        }

        // Default response for anything else
        return new ChatResponse(getRandomResponse(defaultResponses));
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String getRandomResponse(List<String> responses) {
        return responses.get(random.nextInt(responses.size()));
    }
}