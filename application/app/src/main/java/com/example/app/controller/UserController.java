package com.example.app.controller;

import com.example.app.service.UserService;
import com.example.app.model.User;
import org.springframework.aop.scope.ScopedProxyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("v1/user")
public class UserController {
    @Autowired
    private UserService userService;

//    @GetMapping("/list")
//    public List<User> list(){
//        List<User> users = userService.listUser();
//        return users;
//    }


    @GetMapping("/{id}")
    public  String login(@PathVariable(value = "id") Integer id){
        System.out.println("in getting id");
        // 返回数据库的user
        return userService.login(id);
    }

    @PostMapping("/")
    public String save(@RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("/{id}")
    public String update(@PathVariable(value = "id")Integer id,@RequestBody User user) {
        System.out.println("你好");
        userService.update(id,user);
        return null;
    }

}
