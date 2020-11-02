import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getUser()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getUser().roles;
    }
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm)
    .subscribe(loginUser => {
      this.tokenStorageService.saveToken(loginUser.accessToken);
      this.tokenStorageService.saveUser(loginUser);

      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getUser().roles;
      this.router.navigate(['/profile']);
    }, err => {
      this.errorMessage = err.error.message;
      this.isLoginFailed = true;
    });
  }
}
