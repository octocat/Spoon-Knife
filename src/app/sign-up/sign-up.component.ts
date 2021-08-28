import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DataService } from '../data.service';
import * as $ from 'jquery';
import {Router} from '@angular/router';
// import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {
	@Input()
    password: string;
    username: string;
    email: string;
    name: string;
    age: string;
    sex: string;
    residence: string;
    genres: string;

    constructor(private dataService: DataService, private router: Router) {

    }


    ngOnInit() {
    }

    // usernameKey(event: any) {
    //    this.dataService.username = event.target.value;
    // }
    // passwordKey(event: any) {
    //    this.dataService.password = event.target.value;
    // }

error = '';

    getSignUp() {
		let password = this.password;
		let username = this.username;
    	let email = this.email;
	    let name = this.name;
	    let age = this.age;
	    let sex = this.sex;
	    let residence = this.residence;
	    let genres = this.genres;

		this.dataService.signUp(password, username, email, name, age, sex, residence, genres).subscribe(
				(response) => { 
                console.log(response);				
					this.router.navigate(['./login']);
				},
				(error) => { 
					console.log(error.error);
					this.error = 'u heeft niet alles ingevuld';
				} 
			);
	}

}