import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { ErrorService } from 'src/app/error/error-service';
import { AppComponent } from 'src/app/app.component';
import { ValidatorsModule } from '../../validation/validators.module';
import {ValidationErrorMessagesModule} from '../../validation/validation-error-messages.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../register-and-login.component.css']
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

  constructor(private router: Router, private authService: AuthService, private tokenStorageService: TokenStorageService, private errorService: ErrorService, private appComponent: AppComponent) {}

  ngOnInit(): void {
    ValidationErrorMessagesModule.usernameError.subscribe(errorMessage => {
      this.usernameError = errorMessage;
      this.usernameAlreadyExists = this.usernameError === 'Dieser Benutzername ist bereits vergeben.';
    });
    ValidationErrorMessagesModule.emailError.subscribe(errorMessage => {
      this.emailError = errorMessage;
      this.emailAlreadyExists = this.emailError === 'Diese E-Mail ist bereits vergeben.';
    });
    this.isLoading = false;
    this.registerForm = new FormGroup({
      username: new FormControl(null, ValidatorsModule.usernameValidators),
      password: new FormControl(null, ValidatorsModule.passwordValidators),
      passwordCheck: new FormControl(null, ValidatorsModule.passwordValidators),
      firstname: new FormControl(null, ValidatorsModule.firstnameValidators),
      lastname: new FormControl(null, ValidatorsModule.lastnameValidators),
      email: new FormControl(null, ValidatorsModule.emailValidators),
      company: new FormControl(null, ValidatorsModule.companyValidators)
    });
    if (this.tokenStorageService.getUser()) {
      this.isLoggedIn = true;
    }
    this.changedUsername();
    this.changedPassword();
    this.changedPasswordCheck();
    this.changedFirstname();
    this.changedLastname();
    this.changedEmail();
    this.changedCompany();
  }

  changedUsername(): void {
    ValidationErrorMessagesModule.changedUsername(this.registerForm, this.authService, this.errorService);
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
    ValidationErrorMessagesModule.changedEmail(this.registerForm, this.authService, this.errorService, '');
  }

  changedCompany(): void {
    this.companyError = ValidationErrorMessagesModule.changedCompany(this.registerForm);
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.register(this.registerForm)
    .subscribe(registerData => {
      this.isSignUpFailed = false;
      this.authService.login(this.registerForm)
      .subscribe(loginUser => {
        this.tokenStorageService.saveToken(loginUser.accessToken);
        this.tokenStorageService.saveUser(loginUser);
        this.router.navigate(['/profile']);
        this.appComponent.showSnackbar('Sie wurden erfolgreich registriert');
      }, err => {
        this.errorService.print(err);
        this.isLoading = false;
      });
    }, err => {
      this.isSignUpFailed = true;
      this.isLoading = false;
      this.errorService.print(err);
    });
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
