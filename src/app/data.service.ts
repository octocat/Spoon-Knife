import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {
    username:string = '';
    password:string = '';
    email:string = '';
    name:string = '';
    age:string = '';
    sex:string = '';
    residence:string = '';
    genres:string = '';

    convioURL:string;
    loginMethod:string;

    constructor(private http: HttpClient) {}

    logIn(password, username, ) {
        console.log("hallo");
    return this.http.post('/login', { password: password, username: username }, httpOptions);
  }

  signUp(password, username, email, name, age, sex, residence, genres) {
        console.log("hallo2");
    return this.http.post('/signUp', { password: password, username: username, email: email, name: name, age: age, sex: sex, residence: residence, genres: genres }, httpOptions);
  }

    // usernameKey(value: string) {
    //     this.username + value;
    //     console.log("hallo");
    // }
    // passwordKey(value: string) {
    //     this.password + value;
    //     console.log("hallo2");
    // }
}

