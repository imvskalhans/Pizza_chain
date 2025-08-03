package com.pizzaChain.customerProfile.repository;

import com.pizzaChain.customerProfile.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("SELECT c FROM Customer c WHERE " +
            "LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Customer> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
}