package com.pizzaChain.customerProfile.mapper;

import com.pizzaChain.customerProfile.dto.CreateCustomerDTO;
import com.pizzaChain.customerProfile.dto.UpdateCustomerDTO;
import com.pizzaChain.customerProfile.dto.CustomerDTO;
import com.pizzaChain.customerProfile.model.Customer;

public class CustomerMapper {

    // Converts entity to DTO
    public static CustomerDTO toDTO(Customer user) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setUsername(user.getUsername());
        dto.setDob(user.getDob());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setPostalCode(user.getPostalCode());
        dto.setCountry(user.getCountry());
        dto.setState(user.getState());
        dto.setCity(user.getCity());
        dto.setPhotoPath(user.getPhotoPath());
        dto.setInterests(user.getInterests());
        dto.setNewsletter(user.isNewsletter());
        dto.setTerms(user.isTerms());
        return dto;
    }

    // Converts CreateCustomerDTO to Entity (for creation)
    public static Customer toEntity(CreateCustomerDTO dto) {
        Customer user = new Customer();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        user.setDob(dto.getDob());
        user.setGender(dto.getGender());
        user.setAddress(dto.getAddress());
        user.setPostalCode(dto.getPostalCode());
        user.setCountry(dto.getCountry());
        user.setState(dto.getState());
        user.setCity(dto.getCity());
        user.setPhotoPath(dto.getPhotoPath());
        user.setInterests(dto.getInterests());
        user.setNewsletter(dto.isNewsletter());
        user.setTerms(dto.isTerms());
        return user;
    }

    // Converts UpdateCustomerDTO to Entity (for updates)
    public static Customer toEntity(UpdateCustomerDTO dto) {
        Customer user = new Customer();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        user.setDob(dto.getDob());
        user.setGender(dto.getGender());
        user.setAddress(dto.getAddress());
        user.setPostalCode(dto.getPostalCode());
        user.setCountry(dto.getCountry());
        user.setState(dto.getState());
        user.setCity(dto.getCity());
        user.setPhotoPath(dto.getPhotoPath());
        user.setInterests(dto.getInterests());
        user.setNewsletter(dto.getNewsletter());
        user.setTerms(dto.getTerms());
        return user;
    }

    // Helper method to update existing customer with DTO data
    public static void updateCustomerFromDTO(Customer existing, UpdateCustomerDTO dto) {
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
        existing.setInterests(dto.getInterests());
        existing.setNewsletter(dto.getNewsletter());
        existing.setTerms(dto.getTerms());

        // Only update password if provided and not blank
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existing.setPassword(dto.getPassword());
        }

        // Only update photoPath if provided
        if (dto.getPhotoPath() != null) {
            existing.setPhotoPath(dto.getPhotoPath());
        }
    }
}