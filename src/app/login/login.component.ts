import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DataService } from '../data.service';
import * as $ from 'jquery';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
	@Input()
    password: string;
    username: string;

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

    getInlog() {
		let password = this.password;
		let username = this.username;

		this.dataService.logIn(password, username).subscribe(
				(response) => { 
					console.log(response);
					this.router.navigate(['./home']);
				},
				(error) => { 
					console.log(error.error);
					this.error = 'Uw wachtwoord en/of gebruikersnaam zijn onjuist.';
				} 
			);
	}

}