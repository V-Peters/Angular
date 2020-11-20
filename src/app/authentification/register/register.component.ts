import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { ErrorService } from 'src/app/error/error-service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../register-and-login.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  isSignUpFailed = false;
  isLoggedIn = false;
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
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),
      passwordCheck: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),
      firstname: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      lastname: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      email: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.email]),
      company: new FormControl(null, [Validators.required, Validators.maxLength(100)])
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
    this.usernameAlreadyExists = false;
    const errors = this.registerForm.controls.username.errors;
    this.usernameError = this.changed(errors).replace('{}', 'en Benutzernamen');
    if (this.registerForm.controls.username.valid) {
      this.authService.checkIfUsernameExists(this.registerForm.value.username)
      .subscribe(data => {
        if (data === true) {
          this.usernameError = 'Dieser Benutzername ist bereits vergeben.';
          this.usernameAlreadyExists = true;
        }
      }, err => {
        this.errorService.print(err);
      });
    }
  }

  changedPassword(): void {
    const errors = this.registerForm.controls.password.errors;
    this.passwordError = this.changed(errors).replace('{}', ' Passwort');
    this.changedPasswordCheck();
  }

  changedPasswordCheck(): void {
    if (this.registerForm.value.password !== this.registerForm.value.passwordCheck) {
      this.passwordCheckError = 'Die beiden Passwörter stimmen nicht überein';
    } else {
      this.passwordCheckError = '';
    }
  }

  changedFirstname(): void {
    const errors = this.registerForm.controls.firstname.errors;
    this.firstnameError = this.changed(errors).replace('{}', 'en Vornamen');
  }

  changedLastname(): void {
    const errors = this.registerForm.controls.lastname.errors;
    this.lastnameError = this.changed(errors).replace('{}', 'en Nachnamen');
  }

  changedEmail(): void {
    this.emailAlreadyExists = false;
    const errors = this.registerForm.controls.email.errors;
    this.emailError = this.changed(errors).replace('{}', 'e gültige E-Mail ');
    if (this.registerForm.controls.email.valid) {
      this.authService.checkIfEmailExists(this.registerForm.value.email)
      .subscribe(data => {
        if (data === true) {
          this.emailError = 'Diese E-Mail ist bereits vergeben.';
          this.emailAlreadyExists = true;
        }
      }, err => {
        this.errorService.print(err);
      });
    }
  }

  changedCompany(): void {
    const errors = this.registerForm.controls.company.errors;
    this.companyError = this.changed(errors).replace('{}', 'e Firma');
  }

  changed(errors: any): string {
    if (errors) {
      if (errors.required || errors.email) {
        return 'Bitte geben Sie ein{} ein.';
      } else if (errors.minlength) {
        return 'muss mindestens ' + errors.minlength.requiredLength + ' Zeichen lang sein.';
      } else if (errors.maxlength) {
        return 'darf maximal ' + errors.maxlength.requiredLength + ' Zeichen lang sein.';
      }
    }
    return '';
  }

  onSubmit(): void {
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
      });
    }, err => {
      this.isSignUpFailed = true;
      this.errorService.print(err);
    });
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

}
