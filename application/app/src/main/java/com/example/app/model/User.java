package com.example.app.model;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Component;
import java.util.Date;



@Entity
@Table(name = "t_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;
    private String firstname;
    private String lastname;
    private String createTime;
    private String updateTime;

    public User() {
    }

    public Integer getId() {
        return id;
    }

    public String getStringId(){
        return getId().toString();
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String  updateTime) {
        this.updateTime = updateTime;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                '}';
    }


    public String getUserInfo(){
        return "{" + "id:" + id + '\n' +
                "firstname : " + "\""+ firstname + "\" "+ '\n' +
                "lastname : " + "\""+lastname + "\" "+ '\n' +
                "username :" + "\""+username +  "\" " + '\n' +
                "createTime :" +  "account_created " + "\"" + createTime +"\""+'\n' +
                "updateTime :" +  "account_updated "+ "\"" +updateTime +"\"" +
                '}';
    }

}
