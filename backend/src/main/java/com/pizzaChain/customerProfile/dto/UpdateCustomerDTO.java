package com.pizzaChain.customerProfile.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateCustomerDTO {

//    @Pattern(
//            regexp = "^$|^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
//            message = "Please enter a valid email address"
//    )
    @Email(message = "Email must be a valid email address")
    private String email;

    @Pattern(
            regexp = "^$|^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
            message = "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
    )
    private String password;

    @Pattern(regexp = "^[+]?[1-9][\\d]{0,15}$", message = "Please enter a valid phone number")
    private String phone;

    @Pattern(regexp = "^[A-Za-z0-9\\s-]{3,10}$", message = "Please enter a valid postal code")
    private String postalCode;

    private String address;
    private String country;
    private String state;
    private String city;

    private List<String> interests;
    private Boolean newsletter;
    private Boolean terms;

    @Size(max = 500, message = "Photo path must not exceed 500 characters")
    private String photoPath;

    public UpdateCustomerDTO() {}

    // Getters and Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public Boolean getNewsletter() {
        return newsletter;
    }

    public void setNewsletter(Boolean newsletter) {
        this.newsletter = newsletter;
    }

    public Boolean getTerms() {
        return terms;
    }

    public void setTerms(Boolean terms) {
        this.terms = terms;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

}
