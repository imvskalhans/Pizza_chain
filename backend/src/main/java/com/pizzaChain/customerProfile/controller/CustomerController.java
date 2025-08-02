package com.pizzaChain.customerProfile.controller;

import com.pizzaChain.customerProfile.dto.CreateCustomerDTO;
import com.pizzaChain.customerProfile.dto.CustomerDTO;
import com.pizzaChain.customerProfile.mapper.CustomerMapper;
import com.pizzaChain.customerProfile.model.Customer;
import com.pizzaChain.customerProfile.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Case 1: JSON only (application/json)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerDTO> createCustomerJsonOnly(@RequestBody CreateCustomerDTO dto) {
        Customer customer = CustomerMapper.toEntity(dto);
        Customer saved = customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(CustomerMapper.toDTO(saved));
    }

    // Case 2: multipart/form-data with photo + JSON in "customer"
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomerDTO> createCustomerWithPhoto(
            @RequestPart("customer") CreateCustomerDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        String photoPath = savePhoto(photo);
        if (photoPath == null && photo != null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        dto.setPhotoPath(photoPath);
        Customer customer = CustomerMapper.toEntity(dto);
        Customer saved = customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(CustomerMapper.toDTO(saved));
    }

    // Get all customers
//    @GetMapping
//    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
//        List<CustomerDTO> dtos = customerService.getAllCustomers().stream()
//                .map(CustomerMapper::toDTO)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//}

    // get all customer with pagination
    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> getAllCustomers(Pageable pageable) {
        Page<Customer> page = customerService.getAllCustomers(pageable);
        Page<CustomerDTO> dtoPage = page.map(CustomerMapper::toDTO);
        return ResponseEntity.ok(dtoPage);
    }


    // Get customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable UUID id) {
        return customerService.getCustomerById(id)
                .map(CustomerMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get customer by email
    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDTO> getCustomerByEmail(@PathVariable String email) {
        return customerService.getCustomerByEmail(email)
                .map(CustomerMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search customers by name
    @GetMapping("/name/{name}")
    public ResponseEntity<List<CustomerDTO>> getCustomerByName(@PathVariable String name) {
        List<CustomerDTO> result = customerService.getAllCustomers().stream()
                .filter(customer -> {
                    String fullName = (customer.getFirstName() + " " + customer.getLastName()).toLowerCase();
                    return fullName.contains(name.toLowerCase());
                })
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());

        return result.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(result);
    }

    // Case 3: Update using multipart/form-data (photo + JSON)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomerDTO> updateCustomerWithPhoto(
            @PathVariable UUID id,
            @RequestPart("customer") CreateCustomerDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        Optional<Customer> optionalCustomer = customerService.getCustomerById(id);
        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer existing = optionalCustomer.get();

        // Handle file upload if a new photo is provided
        if (photo != null && !photo.isEmpty()) {
            try {
                String uploadDir = "uploads/";
                String fileName = UUID.randomUUID() + "_" + photo.getOriginalFilename();
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                existing.setPhotoPath("/uploads/" + fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        // Update fields
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setAddress(dto.getAddress());
        existing.setPostalCode(dto.getPostalCode());
        existing.setCountry(dto.getCountry());
        existing.setState(dto.getState());
        existing.setCity(dto.getCity());
        existing.setInterests(dto.getInterests());
        existing.setNewsletter(dto.isNewsletter());
        existing.setTerms(dto.isTerms());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existing.setPassword(dto.getPassword());
        }

        Customer updated = customerService.createCustomer(existing);
        return ResponseEntity.ok(CustomerMapper.toDTO(updated));
    }


    // Case 4: Update using JSON only (legacy)
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerDTO> updateCustomerJsonOnly(@PathVariable UUID id, @RequestBody CreateCustomerDTO dto) {
        return customerService.getCustomerById(id).map(existing -> {
            existing.setFirstName(dto.getFirstName());
            existing.setLastName(dto.getLastName());
            existing.setEmail(dto.getEmail());
            existing.setPhone(dto.getPhone());
            existing.setDob(dto.getDob());
            existing.setGender(dto.getGender());
            existing.setAddress(dto.getAddress());
            existing.setPostalCode(dto.getPostalCode());
            existing.setCountry(dto.getCountry());
            existing.setState(dto.getState());
            existing.setCity(dto.getCity());
            existing.setPhotoPath(dto.getPhotoPath());
            existing.setInterests(dto.getInterests());
            existing.setNewsletter(dto.isNewsletter());
            existing.setTerms(dto.isTerms());

            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                existing.setPassword(dto.getPassword());
            }

            Customer updated = customerService.createCustomer(existing);
            return ResponseEntity.ok(CustomerMapper.toDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    //  Delete customer
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable UUID id) {
        if (customerService.getCustomerById(id).isPresent()) {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Helper to handle photo saving
    private String savePhoto(MultipartFile photo) {
        try {
            String uploadDir = "uploads/";
            String fileName = UUID.randomUUID() + "_" + photo.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
