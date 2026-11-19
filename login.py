def login(username, password):
    if username == "admin" and password == "admin123":
        return "Login Successful"
    else:
        return "Invalid Username or Password"


if __name__ == "__main__":
    print(login("admin", "admin123"))
    print(login("admin", "wrong"))
    