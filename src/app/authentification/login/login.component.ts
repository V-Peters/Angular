import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { ErrorService } from 'src/app/error/error-service';
import { AppComponent } from '../../app.component';
import { ValidatorsModule } from '../../validation/validators.module';
import { LoginResponse } from '../login-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth-form.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  isLoading: boolean;
  isUsernameLogin: boolean;

  constructor(private router: Router, private authService: AuthService, private tokenStorageService: TokenStorageService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl(null, ValidatorsModule.usernameValidators),
      password: new FormControl(null, ValidatorsModule.passwordValidators)
    });
    this.isUsernameLogin = true;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.login(this.loginForm)
    .subscribe(loginResponse => {
      if (loginResponse){
        this.login(loginResponse);
      } else {
        this.isLoginFailed = false;
      }
    }, err => {
      this.isLoginFailed = true;
      this.isLoading = false;
      this.errorService.print(err);
    });
  }

  login(loginResponse: LoginResponse): void {
    this.tokenStorageService.saveLogin(loginResponse);
    this.router.navigate(['/meeting/list']);
    this.appComponent.showSnackbar('Herzlich willkommen '.concat(this.tokenStorageService.isAdmin() ? 'Administrator' : (this.tokenStorageService.getUser().firstname + ' ' + this.tokenStorageService.getUser().lastname)));
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  onForgoPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  changeIsUsernameLogin(): void {
    this.isUsernameLogin = !this.isUsernameLogin;
    this.loginForm.reset();
    if (this.isUsernameLogin) {
      this.loginForm.controls.usernameOrEmail.setValidators(ValidatorsModule.usernameValidators);
    } else {
      this.loginForm.controls.usernameOrEmail.setValidators(ValidatorsModule.emailValidators);
    }
  }
}
