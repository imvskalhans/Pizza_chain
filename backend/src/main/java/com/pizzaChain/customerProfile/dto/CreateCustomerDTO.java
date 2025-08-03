package com.pizzaChain.customerProfile.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public class CreateCustomerDTO {

    @NotBlank(message = "First name must be 2-50 characters and contain only letters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name must be 2-50 characters and contain only letters")
    private String firstName;

    @NotBlank(message = "Last name must be 2-50 characters and contain only letters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name must be 2-50 characters and contain only letters")
    private String lastName;

//    @Pattern(
//            regexp = "^$|^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
//            message = "Please enter a valid email address"
//    )
    @Email(message = "Email must be a valid email address")
    private String email;


    @Size(min = 8, message = "Password must be at least 8 characters with uppercase, lowercase, number, and special character")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&].*$",
            message = "Password must be at least 8 characters with uppercase, lowercase, number, and special character")
    private String password;

    @NotBlank(message = "Please enter a valid phone number")
    @Pattern(regexp = "^[+]?[1-9][\\d]{0,15}$", message = "Please enter a valid phone number")
    private String phone; // Optional field - no @NotBlank

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dob;

    @NotBlank(message = "Please select your gender")
    @Pattern(regexp = "^(male|female|other)$", message = "Please select your gender")
    private String gender;

    @NotBlank(message = "Please select your country")
    private String country;

    @NotBlank(message = "Please select your state/province")
    private String state;

    @NotBlank(message = "Please select your city")
    private String city;

    @NotBlank(message = "Please enter a valid postal code")
    @Pattern(regexp = "^[A-Za-z0-9\\s-]{3,10}$", message = "Please enter a valid postal code")
    private String postalCode;

    @Size(max = 200, message = "Address must not exceed 200 characters")
    private String address; // Optional field

    private List<String> interests; // Optional field

    private boolean newsletter; // Optional boolean, defaults to false

    @AssertTrue(message = "You must agree to the terms and conditions")
    private boolean terms;

    @Size(max = 500, message = "Photo path must not exceed 500 characters")
    private String photoPath; // Optional field  // For hybrid mode: store generated path or incoming value

    public CreateCustomerDTO() {}

    // Getters and setters

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
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

    public boolean isNewsletter() {
        return newsletter;
    }

    public void setNewsletter(boolean newsletter) {
        this.newsletter = newsletter;
    }

    public boolean isTerms() {
        return terms;
    }

    public void setTerms(boolean terms) {
        this.terms = terms;
    }
}
