package com.pizzaChain.userProfile.mapper;

import com.pizzaChain.userProfile.dto.CreateCustomerDTO;
import com.pizzaChain.userProfile.dto.CustomerDTO;
import com.pizzaChain.userProfile.model.Customer;

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

    // Converts CreateCustomerDTO to Entity (photoPath must be set in controller before calling this)
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
}
