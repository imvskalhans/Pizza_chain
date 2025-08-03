package com.pizzaChain.customerProfile.controller;

import com.pizzaChain.customerProfile.dto.CreateCustomerDTO;
import com.pizzaChain.customerProfile.dto.CustomerDTO;
import com.pizzaChain.customerProfile.dto.UpdateCustomerDTO;
import com.pizzaChain.customerProfile.mapper.CustomerMapper;
import com.pizzaChain.customerProfile.model.Customer;
import com.pizzaChain.customerProfile.service.CustomerService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerService customerService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerDTO> createCustomerJsonOnly(@Valid @RequestBody CreateCustomerDTO dto) {
        try {
            Customer customer = CustomerMapper.toEntity(dto);
            Customer saved = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(CustomerMapper.toDTO(saved));
        } catch (Exception e) {
            logger.error("Error creating customer with JSON: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomerDTO> createCustomerWithPhoto(
            @Valid @RequestPart("customer") CreateCustomerDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        try {
            String photoPath = null;
            if (photo != null && !photo.isEmpty()) {
                photoPath = savePhoto(photo);
                if (photoPath == null) {
                    logger.error("Failed to save photo for customer: {}", dto.getEmail());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }

            dto.setPhotoPath(photoPath);
            Customer customer = CustomerMapper.toEntity(dto);
            Customer saved = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(CustomerMapper.toDTO(saved));
        } catch (Exception e) {
            logger.error("Error creating customer with photo: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> getAllCustomers(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        try {
            Page<Customer> page = customerService.getAllCustomers(pageable, search);
            Page<CustomerDTO> dtoPage = page.map(CustomerMapper::toDTO);
            return ResponseEntity.ok(dtoPage);
        } catch (Exception e) {
            logger.error("Error fetching customers: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable UUID id) {
        try {
            return customerService.getCustomerById(id)
                    .map(CustomerMapper::toDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching customer by ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDTO> getCustomerByEmail(@PathVariable String email) {
        try {
            return customerService.getCustomerByEmail(email)
                    .map(CustomerMapper::toDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching customer by email {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<CustomerDTO>> getCustomerByName(@PathVariable String name) {
        try {
            List<CustomerDTO> result = customerService.getAllCustomers().stream()
                    .filter(customer -> {
                        String fullName = (customer.getFirstName() + " " + customer.getLastName()).toLowerCase();
                        return fullName.contains(name.toLowerCase());
                    })
                    .map(CustomerMapper::toDTO)
                    .collect(Collectors.toList());

            return result.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error searching customers by name {}: {}", name, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomerDTO> updateCustomerWithPhoto(
            @PathVariable UUID id,
            @Valid @RequestPart("customer") UpdateCustomerDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        try {
            Optional<Customer> optionalCustomer = customerService.getCustomerById(id);
            if (optionalCustomer.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Customer existing = optionalCustomer.get();

            if (photo != null && !photo.isEmpty()) {
                String photoPath = savePhoto(photo);
                if (photoPath == null) {
                    logger.error("Failed to save photo during update for customer ID: {}", id);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
                existing.setPhotoPath(photoPath);
            }

            CustomerMapper.updateEntity(existing, dto);
            Customer updated = customerService.updateCustomer(existing);
            return ResponseEntity.ok(CustomerMapper.toDTO(updated));
        } catch (Exception e) {
            logger.error("Error updating customer with photo, ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerDTO> updateCustomerJsonOnly(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCustomerDTO dto) {

        try {
            return customerService.getCustomerById(id).map(existing -> {
                CustomerMapper.updateEntity(existing, dto);
                Customer updated = customerService.updateCustomer(existing);
                return ResponseEntity.ok(CustomerMapper.toDTO(updated));
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error updating customer with JSON, ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable UUID id) {
        try {
            if (customerService.getCustomerById(id).isPresent()) {
                customerService.deleteCustomer(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error deleting customer ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String savePhoto(MultipartFile photo) {
        if (photo == null || photo.isEmpty()) {
            return null;
        }

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
            logger.error("Failed to save photo: {}", e.getMessage(), e);
            return null;
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        logger.error("Unhandled exception: {}", e.getMessage(), e);
        Map<String, String> error = new HashMap<>();
        error.put("error", "An internal server error occurred");
        error.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
