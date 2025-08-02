package com.pizzaChain.customerProfile.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class CustomerDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String username;
    private LocalDate dob;
    private String gender;
    private String address;
    private String postalCode;
    private String country;
    private String state;
    private String city;
    private String photoPath;
    private List<String> interests;
    private boolean newsletter;
    private boolean terms;

    public CustomerDTO() {}

    // All-args constructor or use Builder pattern if preferred

    public CustomerDTO(String firstName, UUID id, String lastName, String phone, String email, String username, LocalDate dob, String address, String gender, String postalCode, String country, String state, String city, String photoPath, List<String> interests, boolean newsletter, boolean terms) {
        this.firstName = firstName;
        this.id = id;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.username = username;
        this.dob = dob;
        this.address = address;
        this.gender = gender;
        this.postalCode = postalCode;
        this.country = country;
        this.state = state;
        this.city = city;
        this.photoPath = photoPath;
        this.interests = interests;
        this.newsletter = newsletter;
        this.terms = terms;
    }

    // Add getters and setters


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
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
