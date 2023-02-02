package com.example.app;

import com.example.app.model.User;
import com.example.app.service.impls.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AppApplicationTests {
    @Autowired
    private UserServiceImpl ServiceDao;
    @Test
    void contextLoads() {
        System.out.println("test...... ");
        ServiceDao.save(new User());
        ServiceDao.listUser();
        System.out.println("test finished");

    }
}
