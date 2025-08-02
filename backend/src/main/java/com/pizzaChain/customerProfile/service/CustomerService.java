package com.pizzaChain.customerProfile.service;

import com.pizzaChain.customerProfile.model.Customer;
import com.pizzaChain.customerProfile.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Create and save a new customer
    public Customer createCustomer(Customer customer) {
        if (Optional.ofNullable(customer.getPassword()).orElse("").isBlank()) {
            customer.setPassword("defaultPass123");
        }
        return customerRepository.save(customer);
    }

    // Return paginated customers
    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    // Return all customers (for name search etc.)
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

    // Get customers by name (first + last combined)
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
