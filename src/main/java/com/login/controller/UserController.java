package com.login.controller;

import com.login.model.User;
import com.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        userService.saveUser(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User existing = userService.getUserByUsername(user.getUsername());
        if(existing != null && existing.getPassword().equals(user.getPassword())) {
            return "Logged in successfully";
        }else {
            return "Invalid username or password";
        }
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

}
