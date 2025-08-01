package com.pizzaChain.userProfile.service;

import com.pizzaChain.userProfile.model.Customer;
import com.pizzaChain.userProfile.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Create and save a new customer
    public Customer createCustomer(Customer customer) {
        // Set a default password if none provided
        if (Optional.ofNullable(customer.getPassword()).orElse("").isBlank()) {
            customer.setPassword("defaultPass123"); // Ideally hashed
        }

        return customerRepository.save(customer);
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    public Optional<Customer> getCustomerById(UUID id) {
        return customerRepository.findById(id);
    }

    // Get customer by email
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    // Get customer by name (first + last combined)
    public List<Customer> getCustomersByName(String name) {
        String nameLower = name.toLowerCase();
        return customerRepository.findAll().stream()
                .filter(c -> (c.getFirstName() + " " + c.getLastName()).toLowerCase().contains(nameLower))
                .toList();
    }

    // Get customer by username
    public Optional<Customer> getCustomerByUsername(String username) {
        return customerRepository.findByUsername(username);
    }

    // Delete customer by ID
    public void deleteCustomer(UUID id) {
        customerRepository.deleteById(id);
    }

    // Check username availability
    public boolean existsByUsername(String username) {
        return customerRepository.existsByUsername(username);
    }
}
