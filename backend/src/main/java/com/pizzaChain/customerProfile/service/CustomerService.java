package com.pizzaChain.customerProfile.service;

import com.pizzaChain.customerProfile.model.Customer;
import com.pizzaChain.customerProfile.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // ✅ Create new customer (email uniqueness enforced)
    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        if (Optional.ofNullable(customer.getPassword()).orElse("").isBlank()) {
            customer.setPassword("defaultPass123");
        }

        return customerRepository.save(customer);
    }

    // ✅ Update existing customer without checking email duplication unless it's changed
    public Customer updateCustomer(Customer updatedCustomer) {
        UUID id = updatedCustomer.getId();
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer not found"));

        // Only update email if it's changed and not taken by another user
        String newEmail = updatedCustomer.getEmail();
        if (newEmail != null && !newEmail.equalsIgnoreCase(existing.getEmail())) {
            if (customerRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email is already in use by another account.");
            }
            existing.setEmail(newEmail);
        }

        if (updatedCustomer.getPhone() != null) existing.setPhone(updatedCustomer.getPhone());
        if (updatedCustomer.getPassword() != null && !updatedCustomer.getPassword().isBlank()) {
            existing.setPassword(updatedCustomer.getPassword());
        }

        if (updatedCustomer.getAddress() != null) existing.setAddress(updatedCustomer.getAddress());
        if (updatedCustomer.getPostalCode() != null) existing.setPostalCode(updatedCustomer.getPostalCode());
        if (updatedCustomer.getCountry() != null) existing.setCountry(updatedCustomer.getCountry());
        if (updatedCustomer.getState() != null) existing.setState(updatedCustomer.getState());
        if (updatedCustomer.getCity() != null) existing.setCity(updatedCustomer.getCity());
        if (updatedCustomer.getPhotoPath() != null) existing.setPhotoPath(updatedCustomer.getPhotoPath());
        if (updatedCustomer.getInterests() != null) existing.setInterests(updatedCustomer.getInterests());

        existing.setNewsletter(updatedCustomer.isNewsletter());
        existing.setTerms(updatedCustomer.isTerms());

        return customerRepository.save(existing);
    }

    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

//    public List<Customer> getAllCustomers() {
//        return customerRepository.findAll();
//    }
public List<Customer> getAllCustomers() {
    return customerRepository.findAll();
}

    public Page<Customer> getAllCustomers(Pageable pageable, String searchTerm) {
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            return customerRepository.findBySearchTerm(searchTerm.trim(), pageable);
        } else {
            return customerRepository.findAll(pageable);
        }
    }


    public Optional<Customer> getCustomerById(UUID id) {
        return customerRepository.findById(id);
    }

    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public List<Customer> getCustomersByName(String name) {
        String nameLower = name.toLowerCase();
        return customerRepository.findAll().stream()
                .filter(c -> (c.getFirstName() + " " + c.getLastName()).toLowerCase().contains(nameLower))
                .toList();
    }

    public Optional<Customer> getCustomerByUsername(String username) {
        return customerRepository.findByUsername(username);
    }

    public void deleteCustomer(UUID id) {
        customerRepository.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return customerRepository.existsByUsername(username);
    }
}
