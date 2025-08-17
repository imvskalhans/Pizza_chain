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

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // For updates - check uniqueness but exclude current customer
    boolean existsByEmailAndIdNot(String email, UUID id);

    boolean existsByUsernameAndIdNot(String username, UUID id);

    @Query("""
       SELECT c FROM Customer c
       WHERE 
           LOWER(c.firstName) LIKE LOWER(:keyword)
        OR LOWER(c.lastName) LIKE LOWER(:keyword)
        OR LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(:keyword)
        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
       """)
    Page<Customer> searchByNameOrEmail(@Param("keyword") String keyword, Pageable pageable);

}