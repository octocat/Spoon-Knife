package com.example.app.service;
import com.example.app.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;



public interface UserService {
    public User getUserById(Integer id);
    public List<User> listUser();
    public String save(User user);
    public String update(Integer id,User user);
    public String login(Integer id);

}
