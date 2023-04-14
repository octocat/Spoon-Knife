package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

import java.io.Console;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.DriverManager;
import javax.sql.DataSource;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;

@SpringBootApplication
public class SpringSampleAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringSampleAppApplication.class, args);
	}
}


@RestController
@RequestMapping("/")
@RefreshScope
@Component
class HomeRestController {

	boolean healthy=true;
    String hostname="";
	public  HomeRestController(){
		try {
			hostname= "Hello World from " + InetAddress.getLocalHost().getHostName().toString();
		}
		catch (UnknownHostException ex){
			hostname= "error";
		}
	}

	@RequestMapping("/")
	public String home(){
         return "<h1>"+hostname+"</h1>";
	}

	@RequestMapping("/healthz")
	public ResponseEntity healthz(){
		if (healthy)
			return new ResponseEntity(HttpStatus.ACCEPTED);
		else
			return new ResponseEntity(HttpStatus.NOT_ACCEPTABLE);
	}

	@RequestMapping("/cancer")
	public String cancer(){
		healthy=false;
		return "Killed "+hostname;
	}

	@Autowired
	private Environment env;

	@RequestMapping("/dbtest")
	public String dbtest(){

		String sql = "SELECT * FROM customer";
		Connection conn = null;

		try {
			//String connURL="jdbc:mysql://"+env.getProperty("MYSQL_SERVICE_HOST")+":"+env.getProperty("MYSQL_SERVICE_PORT")+"/"+env.getProperty("MYSQL_DATABASE")+"?useSSL=false";
			//System.out.println("URL:  "+connURL);
			//conn =  DriverManager.getConnection(connURL,env.getProperty("MYSQL_USER"),env.getProperty("MYSQL_PASSWORD"));
			conn =  DriverManager.getConnection(env.getProperty("spring.datasource.url"),env.getProperty("spring.datasource.username"),env.getProperty("spring.datasource.password"));
                        System.out.println("connection url: "+env.getProperty("spring.datasource.url"));
			//System.out.println("Username: "+env.getProperty("spring.datasource.username")+"\nPassword: "+env.getProperty("spring.datasource.password"));
			PreparedStatement ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			String res="<h1>Customers List</h1></br>";
			while (rs.next()) {
			     res=res+"CustomerId: "+rs.getInt("CUST_ID") + "  Customer Name: "+ rs.getString("NAME")+"  Age: "+rs.getInt("Age")+"</br>";
			} 
			rs.close();
			return res;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {}
			}
		}
	}


}
