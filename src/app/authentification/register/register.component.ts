import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { ErrorService } from 'src/app/error/error-service';
import { AppComponent } from 'src/app/app.component';
import { ValidatorsModule } from '../../validation/validators.module';
import { ValidationErrorMessagesModule } from '../../validation/validation-error-messages.module';
import { UserService } from '../../user/user.service';
import { LoginResponse } from '../login-response.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth-form.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  isSignUpFailed = false;
  isLoggedIn = false;
  isLoading: boolean;
  usernameAlreadyExists: boolean;
  emailAlreadyExists: boolean;
  usernameError: string;
  passwordError: string;
  passwordCheckError: string;
  firstnameError: string;
  lastnameError: string;
  emailError: string;
  companyError: string;

  constructor(private router: Router, private authService: AuthService, private userService: UserService, private tokenStorageService: TokenStorageService, private errorService: ErrorService, private appComponent: AppComponent) {}

  ngOnInit(): void {
    this.tokenStorageService.signOut();
    ValidationErrorMessagesModule.usernameError.subscribe(errorMessage => {
      this.usernameError = errorMessage;
      this.usernameAlreadyExists = this.usernameError === 'Dieser Benutzername ist bereits vergeben.';
    });
    ValidationErrorMessagesModule.emailError.subscribe(errorMessage => {
      this.emailError = errorMessage;
      this.emailAlreadyExists = this.emailError === 'Diese E-Mail ist bereits vergeben.';
    });
    this.isLoading = false;
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    this.registerForm = new FormGroup({
      username: new FormControl(null, ValidatorsModule.usernameValidators),
      password: new FormControl(null, ValidatorsModule.passwordValidators),
      passwordCheck: new FormControl(null, ValidatorsModule.passwordValidators),
      firstname: new FormControl(null, ValidatorsModule.firstnameValidators),
      lastname: new FormControl(null, ValidatorsModule.lastnameValidators),
      email: new FormControl(null, ValidatorsModule.emailValidators),
      company: new FormControl(null, ValidatorsModule.companyValidators)
    });
    this.changedUsername();
    this.changedPassword();
    this.changedPasswordCheck();
    this.changedFirstname();
    this.changedLastname();
    this.changedEmail();
    this.changedCompany();
  }

  changedUsername(): void {
    ValidationErrorMessagesModule.changedUsername(this.registerForm, this.userService, this.errorService);
  }

  changedPassword(): void {
    this.passwordError = ValidationErrorMessagesModule.changedPassword(this.registerForm);
    this.changedPasswordCheck();
  }

  changedPasswordCheck(): void {
    this.passwordCheckError = ValidationErrorMessagesModule.changedPasswordCheck(this.registerForm);
  }

  changedFirstname(): void {
    this.firstnameError = ValidationErrorMessagesModule.changedFirstname(this.registerForm);
  }

  changedLastname(): void {
    this.lastnameError = ValidationErrorMessagesModule.changedLastname(this.registerForm);
  }

  changedEmail(): void {
    ValidationErrorMessagesModule.changedEmail(this.registerForm, this.userService, this.errorService, '');
  }

  changedCompany(): void {
    this.companyError = ValidationErrorMessagesModule.changedCompany(this.registerForm);
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.register(this.registerForm)
    .subscribe(registerData => {
      if (registerData) {
        this.tryToLogin();
      } else {
        this.isSignUpFailed = true;
      }
    }, err => {
      this.isSignUpFailed = true;
      this.isLoading = false;
      this.errorService.print(err);
    });
  }

  tryToLogin(): void {
    this.isSignUpFailed = false;
    this.authService.login(this.registerForm)
    .subscribe(loginResponse => {
      if (loginResponse) {
        this.login(loginResponse);
      } else {
        this.isSignUpFailed = true;
      }
    }, err => {
      this.errorService.print(err);
      this.isLoading = false;
    });
  }

  login(loginResponse: LoginResponse): void {
    this.tokenStorageService.saveLogin(loginResponse);
    this.router.navigate(['/profile']);
    this.appComponent.showSnackbar('Sie wurden erfolgreich registriert');
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
