package com.pizzaChain.customerProfile.service;

import com.pizzaChain.customerProfile.dto.CustomerDTO;
import com.pizzaChain.customerProfile.mapper.CustomerMapper;
import com.pizzaChain.customerProfile.model.Customer;
import com.pizzaChain.customerProfile.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // === CREATE ===
    public Customer createCustomer(Customer customer) {
        if (Optional.ofNullable(customer.getPassword()).orElse("").isBlank()) {
            customer.setPassword("defaultPass123");
        }
        return customerRepository.save(customer);
    }

    // === READ ===
    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
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

    // === DELETE ===
    public void deleteCustomer(UUID id) {
        customerRepository.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return customerRepository.existsByUsername(username);
    }

    // === UPDATE (conditional) ===
    public Customer updateCustomer(Customer existing, Customer updates) {
        if (updates.getFirstName() != null) existing.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) existing.setLastName(updates.getLastName());
        if (updates.getEmail() != null) existing.setEmail(updates.getEmail());
        if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
        if (updates.getDob() != null) existing.setDob(updates.getDob());
        if (updates.getGender() != null) existing.setGender(updates.getGender());
        if (updates.getAddress() != null) existing.setAddress(updates.getAddress());
        if (updates.getPostalCode() != null) existing.setPostalCode(updates.getPostalCode());
        if (updates.getCountry() != null) existing.setCountry(updates.getCountry());
        if (updates.getState() != null) existing.setState(updates.getState());
        if (updates.getCity() != null) existing.setCity(updates.getCity());
        if (updates.getInterests() != null) existing.setInterests(updates.getInterests());
        if (updates.isNewsletter() != null) existing.setNewsletter(updates.isNewsletter());
        if (updates.isTerms() != null) existing.setTerms(updates.isTerms());

        if (updates.getPassword() != null && !updates.getPassword().isBlank()) {
            existing.setPassword(updates.getPassword());
        }

        if (updates.getPhotoPath() != null) {
            existing.setPhotoPath(updates.getPhotoPath());
        }

        return customerRepository.save(existing);
    }

    // === Save photo file ===
    public String savePhoto(MultipartFile photo) throws IOException {
        if (photo == null || photo.isEmpty()) {
            return null;
        }

        String uploadDir = "uploads/photos/"; // relative directory inside project root
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = UUID.randomUUID() + "_" + Objects.requireNonNull(photo.getOriginalFilename());
        Path filePath = Paths.get(uploadDir, fileName);
        Files.write(filePath, photo.getBytes());

        // return relative path for frontend (example: "/uploads/photos/abc.jpg")
        return "/" + uploadDir + fileName;
    }
    // === Update after controller has already applied changes ===
    public Customer updateCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Page<CustomerDTO> searchByNameOrEmail(String keyword, Pageable pageable) {
        return customerRepository.searchByNameOrEmail(keyword, pageable)
                .map(CustomerMapper::toDTO);
    }


}
