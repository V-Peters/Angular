import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { ErrorService } from 'src/app/error/error-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../register-and-login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role: string;

  constructor(private router: Router, private authService: AuthService, private tokenStorageService: TokenStorageService, private errorService: ErrorService) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getUser()) {
      this.isLoggedIn = true;
      this.role = this.tokenStorageService.getUser().roles[0].name;
    }
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm)
    .subscribe(loginUser => {
      this.tokenStorageService.saveUser(loginUser);
      this.tokenStorageService.saveToken(loginUser.accessToken);
      this.isLoggedIn = true;

      this.isLoginFailed = false;
      this.role = this.tokenStorageService.getUser().roles[0].name;
      this.router.navigate(['/meeting/list']);
    }, err => {
      this.isLoginFailed = true;
      this.errorService.print(err);
    });
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }
}
