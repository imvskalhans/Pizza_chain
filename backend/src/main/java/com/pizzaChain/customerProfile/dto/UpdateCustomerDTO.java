package com.pizzaChain.customerProfile.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public class UpdateCustomerDTO {

    @Size(min = 2, message = "First name must be at least 2 characters.")
    private String firstName;

    private String lastName;

    @Email(message = "Email should be valid.")
    private String email;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits.")
    private String phone;

    // Password is optional for updates
    @Size(min = 8, message = "Password must be at least 8 characters.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
            message = "Password must contain an uppercase letter, a lowercase letter, and a number."
    )
    private String password;

    @Past(message = "Date of birth must be in the past.")
    private LocalDate dob;

    private String gender;

    private String address;

    private String postalCode;

    private String country;

    private String state;

    private String city;

    private List<String> interests;

    private Boolean newsletter;
    private Boolean terms;

    private String photoPath;

    public UpdateCustomerDTO() {}

    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public Boolean getNewsletter() { return newsletter; }
    public void setNewsletter(Boolean newsletter) { this.newsletter = newsletter; }

    public Boolean getTerms() { return terms; }
    public void setTerms(Boolean terms) { this.terms = terms; }

    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }
}
