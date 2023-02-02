package com.example.app.repository;
import com.example.app.model.User;

import org.springframework.data.jpa.repository.JpaRepository;


@org.springframework.stereotype.Repository
public interface Repository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}
