package com.pizzaChain.userProfile.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    public User() {}

    public User(String name, String email, String phone, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    // Automatically generate username before saving if not provided
    @PrePersist
    private void generateUsername() {
        if (this.username == null || this.username.isBlank()) {
            String namePart = name != null ? name.replaceAll("\\s+", "").toLowerCase() : "user";
            String phonePart = phone != null && phone.length() >= 4
                    ? phone.substring(phone.length() - 4)
                    : String.valueOf(System.currentTimeMillis() % 10000);

            this.username = namePart + "_" + phonePart + "_" + UUID.randomUUID().toString().substring(0, 5);
        }
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
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

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

}
