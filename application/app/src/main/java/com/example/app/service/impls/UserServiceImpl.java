package com.example.app.service.impls;

import com.example.app.model.User;

import com.example.app.repository.Repository;
import com.example.app.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;



@Service
public class UserServiceImpl implements UserService, UserDetailsService {
    @Autowired
    private Repository UserMap;

    @Override
    public User getUserById(Integer id) {
        return UserMap.getById(id);
    }
    @Override
    public List<User> listUser() {
        return UserMap.findAll();
    }
    @Override
    public String save(User user) {
        User saveuser = UserMap.findByUsername(user.getUsername());
        System.out.println("------------------");
        if (saveuser != null){
            System.out.println("user already exist");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        Date date = new Date();
        DateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd :hh:mm:ss");
        user.setCreateTime(dateFormat.format(date));
        user.setUpdateTime(dateFormat.format(date));
        UserMap.save(user);
        return user.getUserInfo();
    }

    @Override
    public String update(Integer id,User user) {
        if(user.getUsername() != null || user.getUpdateTime() != null || user.getCreateTime() != null ||
        user.getId() != null){
            System.out.println("do not allowed to change other elements");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        User olduser = UserMap.getById(id);
        if (olduser != null){
        olduser.setFirstname(user.getFirstname());
        olduser.setLastname(user.getLastname());
        olduser.setPassword(user.getPassword());
        Date date = new Date();
        DateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd :hh:mm:ss");
        user.setUpdateTime(dateFormat.format(date));
        return olduser.getUserInfo();}
        else{
            return null;
        }
    }


    @Override
    public String login(Integer id) {
        User loginuser = UserMap.getById(id);
        if (loginuser == null){
            return null;}
        else{
            return loginuser.getUserInfo();
        }
    }

    public String getUserInfo(User user){
        User infouser = UserMap.getById(user.getId());
        if (infouser != null){
            return infouser.getUserInfo();}
        else{return null;}
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = UserMap.findByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("User do not exist");
        }
        return null;
    }
}
