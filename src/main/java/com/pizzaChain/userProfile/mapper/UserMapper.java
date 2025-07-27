package com.pizzaChain.userProfile.mapper;

import com.pizzaChain.userProfile.dto.CreateUserDTO;
import com.pizzaChain.userProfile.dto.UserDTO;
import com.pizzaChain.userProfile.model.User;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getUsername()
        );
    }

    public static User toEntity(CreateUserDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        return user;
    }
}
