package com.pizzaChain.customerProfile.controller;

import com.pizzaChain.customerProfile.dto.CreateCustomerDTO;
import com.pizzaChain.customerProfile.dto.UpdateCustomerDTO;
import com.pizzaChain.customerProfile.dto.CustomerDTO;
import com.pizzaChain.customerProfile.mapper.CustomerMapper;
import com.pizzaChain.customerProfile.model.Customer;
import com.pizzaChain.customerProfile.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
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
@Validated
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // ---------------- CREATE ----------------

    // JSON only
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createCustomerJsonOnly(@Valid @RequestBody CreateCustomerDTO dto) {
        Customer customer = CustomerMapper.toEntity(dto);
        Customer saved = customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(CustomerMapper.toDTO(saved));
    }

    // multipart/form-data with JSON in "customer" + optional photo
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createCustomerWithPhoto(
            @Valid @RequestPart("customer") CreateCustomerDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        String photoPath = savePhoto(photo);
        if (photo != null && photoPath == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        dto.setPhotoPath(photoPath);
        Customer customer = CustomerMapper.toEntity(dto);
        Customer saved = customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(CustomerMapper.toDTO(saved));
    }

    // ---------------- UPDATE ----------------

    // multipart/form-data (JSON in "customer" + optional photo)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCustomerWithPhoto(
            @PathVariable UUID id,
            @Valid @RequestPart("customer") UpdateCustomerDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        Optional<Customer> optionalCustomer = customerService.getCustomerById(id);
        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer existing = optionalCustomer.get();

        if (photo != null && !photo.isEmpty()) {
            String photoPath = savePhoto(photo);
            if (photoPath != null) {
                existing.setPhotoPath(photoPath);
            }
        }

        applyUpdates(existing, dto);
        Customer updated = customerService.updateCustomer(existing);
        return ResponseEntity.ok(CustomerMapper.toDTO(updated));
    }

    // JSON only
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateCustomerJsonOnly(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCustomerDTO dto) {

        return customerService.getCustomerById(id)
                .map(existing -> {
                    applyUpdates(existing, dto);
                    Customer updated = customerService.updateCustomer(existing);
                    return ResponseEntity.ok(CustomerMapper.toDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------- READ ----------------

    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> getAllCustomers(Pageable pageable) {
        Page<Customer> page = customerService.getAllCustomers(pageable);
        Page<CustomerDTO> dtoPage = page.map(CustomerMapper::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable UUID id) {
        return customerService.getCustomerById(id)
                .map(CustomerMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDTO> getCustomerByEmail(@PathVariable String email) {
        return customerService.getCustomerByEmail(email)
                .map(CustomerMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<CustomerDTO>> getCustomerByName(@PathVariable String name) {
        List<CustomerDTO> result = customerService
                .getAllCustomers(Pageable.unpaged())
                .getContent() // <-- FIXED: use getContent() before stream
                .stream()
                .filter(customer -> {
                    String fullName = (customer.getFirstName() + " " + customer.getLastName()).toLowerCase();
                    return fullName.contains(name.toLowerCase());
                })
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());

        return result.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(result);
    }

    // ---------------- DELETE ----------------

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable UUID id) {
        if (customerService.getCustomerById(id).isPresent()) {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------- HELPERS ----------------

    /** Update only non-null fields from UpdateCustomerDTO */
    private void applyUpdates(Customer existing, UpdateCustomerDTO dto) {
        if (dto.getFirstName() != null) existing.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) existing.setLastName(dto.getLastName());
        if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
        if (dto.getPhone() != null) existing.setPhone(dto.getPhone());
        if (dto.getDob() != null) existing.setDob(dto.getDob());
        if (dto.getGender() != null) existing.setGender(dto.getGender());
        if (dto.getAddress() != null) existing.setAddress(dto.getAddress());
        if (dto.getPostalCode() != null) existing.setPostalCode(dto.getPostalCode());
        if (dto.getCountry() != null) existing.setCountry(dto.getCountry());
        if (dto.getState() != null) existing.setState(dto.getState());
        if (dto.getCity() != null) existing.setCity(dto.getCity());
        if (dto.getInterests() != null) existing.setInterests(dto.getInterests());
        if (dto.getNewsletter() != null) existing.setNewsletter(dto.getNewsletter());
        if (dto.getTerms() != null) existing.setTerms(dto.getTerms());

        // Only if provided and not blank
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existing.setPassword(dto.getPassword());
        }
        if (dto.getPhotoPath() != null) {
            existing.setPhotoPath(dto.getPhotoPath());
        }
    }

    /** Save uploaded photo to /uploads directory and return web path (/uploads/filename) */
    private String savePhoto(MultipartFile photo) {
        if (photo == null || photo.isEmpty()) return null;

        try {
            String uploadDir = "uploads/";
            String fileName = UUID.randomUUID() + "_" + Objects.requireNonNullElse(photo.getOriginalFilename(), "photo");
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

    // -------- Validation error handler (covers @RequestBody/@RequestPart) --------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errors.put(fe.getField(), fe.getDefaultMessage());
        }
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Validation failed");
        body.put("errors", errors);
        return ResponseEntity.badRequest().body(body);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CustomerDTO>> searchCustomers(
            @RequestParam String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(customerService.searchByNameOrEmail(keyword, pageable));
    }


}
