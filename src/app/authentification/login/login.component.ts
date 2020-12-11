import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { ErrorService } from 'src/app/error/error-service';
import { AppComponent } from '../../app.component';
import {User} from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../register-and-login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  isLoading: boolean;

  constructor(private router: Router, private authService: AuthService, private tokenStorageService: TokenStorageService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.isLoading = false;
    if (this.tokenStorageService.getUser()) {
      this.isLoggedIn = true;
    }
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.login(this.loginForm)
    .subscribe(loginUser => {
      if (loginUser){
        this.login(loginUser);
      } else {
        this.isLoginFailed = true;
      }
    }, err => {
      this.isLoginFailed = true;
      this.isLoading = false;
      this.errorService.print(err);
    });
  }

  login(loginUser: User): void {
    this.tokenStorageService.saveUser(loginUser);
    this.router.navigate(['/meeting/list']);
    this.appComponent.showSnackbar('Herzlich willkommen '.concat(this.tokenStorageService.isAdmin() ? 'Administrator' : (this.tokenStorageService.getUser().firstname + ' ' + this.tokenStorageService.getUser().lastname)));
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }
}
