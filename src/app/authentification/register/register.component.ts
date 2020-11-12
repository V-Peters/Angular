import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { ErrorService } from 'src/app/error/error-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../register-and-login.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  isSignUpFailed = false;
  usernameToShort = false;
  usernameToLong = false;
  usernameAlreadyExists = false;
  passwordToShort = false;
  passwordToLong = false;
  firstnameToLong = false;
  lastnameToLong = false;
  emailToLong = false;
  emailAlreadyExists = false;
  companyToLong = false;
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService, private tokenStorageService: TokenStorageService, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),
      firstname: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      lastname: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      email: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.email]),
      company: new FormControl(null, [Validators.required, Validators.maxLength(100)])
    });
    if (this.tokenStorageService.getUser()) {
      this.isLoggedIn = true;
    }
  }

  setUsernameValidatorsToFalse() {
    this.usernameToShort = false;
    this.usernameToLong = false;
    this.usernameAlreadyExists = false;
  }

  setPasswordValidatorsToFalse() {
    this.passwordToShort = false;
    this.passwordToLong = false;
  }

  setFirstnameValidatorsToFalse() {
    this.firstnameToLong = false;
  }

  setLastnameValidatorsToFalse() {
    this.lastnameToLong = false;
  }

  setEmailValidatorsToFalse() {
    this.emailToLong = false;
    this.emailAlreadyExists = false;
  }

  setCompanyValidatorsToFalse() {
    this.companyToLong = false;
  }

  changedUsername() {
    if (this.registerForm.value.username) {
      if (this.registerForm.value.username.length < 4) {
        this.setUsernameValidatorsToFalse();
        this.usernameToShort = true;
      } else if (this.registerForm.value.username.length > 20) {
        this.setUsernameValidatorsToFalse();
        this.usernameToLong = true;
      } else {
        this.authService.checkIfUsernameExists(this.registerForm.value.username)
        .subscribe(data => {
          this.setUsernameValidatorsToFalse();
          if (data.message == 'true') {
            this.usernameAlreadyExists = true;
          }
        }, err => {
          this.errorService.print(err);
        });
      }
    } else {
      this.setUsernameValidatorsToFalse();
    }
  }

  changedPassword() {
    if (this.registerForm.value.password) {
      if (this.registerForm.value.password.length < 5) {
        this.setPasswordValidatorsToFalse();
        this.passwordToShort = true;
      } else if (this.registerForm.value.password.length > 60) {
        this.setPasswordValidatorsToFalse();
        this.passwordToLong = true;
      }
    } else {
      this.setPasswordValidatorsToFalse();
    }
  }

  changedFirstname() {
    if (this.registerForm.value.firstname) {
      if (this.registerForm.value.firstname.length > 50) {
        this.setFirstnameValidatorsToFalse();
        this.firstnameToLong = true;
      }
    } else {
      this.setFirstnameValidatorsToFalse();
    }
  }

  changedLastname() {
    if (this.registerForm.value.lastname) {
      if (this.registerForm.value.lastname.length > 50) {
        this.setLastnameValidatorsToFalse();
        this.lastnameToLong = true;
      }
    } else {
      this.setLastnameValidatorsToFalse();
    }
  }

  changedEmail() {
    if (this.registerForm.value.email) {
      if (this.registerForm.value.email.length > 100) {
        this.setEmailValidatorsToFalse();
        this.emailToLong = true;
      } else {
        this.authService.checkIfEmailExists(this.registerForm.value.email)
        .subscribe(data => {
          this.setEmailValidatorsToFalse();
          if (data.message == 'true') {
            this.emailAlreadyExists = true;
          }
        });
      }
    } else {
      this.setEmailValidatorsToFalse();
    }
  }

  changedCompany() {
    if (this.registerForm.value.company) {
      if (this.registerForm.value.company > 100) {
        this.setCompanyValidatorsToFalse();
        this.companyToLong = true;
      }
    } else {
      this.setCompanyValidatorsToFalse();
    }
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
      }, err => {
        this.errorService.print(err);
      });
    }, err => {
      this.isSignUpFailed = true;
      this.usernameAlreadyExists = true;
      this.emailAlreadyExists = true;
      this.errorService.print(err);
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

}
