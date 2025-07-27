package com.pizzaChain.userProfile.service;

import com.pizzaChain.userProfile.model.User;
import com.pizzaChain.userProfile.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Create and save a new user
    public User createUser(User user) {
        String generatedUsername = generateUniqueUsername(user.getName(), user.getPhone());
        user.setUsername(generatedUsername);

        // Set a default password if none provided
        if (Optional.ofNullable(user.getPassword()).orElse("").isEmpty()) {
            user.setPassword("defaultPass123"); // This should be hashed in a real application
        }

        return userRepository.save(user);
    }

    // Generate a unique username based on name and phone
    private String generateUniqueUsername(String name, String phone) {
        String base = name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        String digits = phone != null ? phone.replaceAll("\\D", "") : "";
        String suffix = digits.length() >= 4 ? digits.substring(digits.length() - 4) : UUID.randomUUID().toString().substring(0, 4);

        String candidate = base + suffix;
        String finalUsername = candidate;
        int count = 1;

        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = candidate + count;
            count++;
        }

        return finalUsername;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Get user by name
    public Optional<User> getUserByName(String name) {
        return userRepository.findByName(name);
    }

    // Get user by username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Delete user by ID
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
