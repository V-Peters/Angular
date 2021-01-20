import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ErrorService } from '../../error/error-service';
import { AppComponent } from '../../app.component';
import { ValidatorsModule } from "../../validation/validators.module";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../auth-form.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  isLoading: boolean;
  isLoggedIn: boolean;
  forgotPasswordForm: FormGroup;
  isDataValid: boolean;

  constructor(private router: Router, private authService: AuthService, private tokenStorageService: TokenStorageService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isDataValid = true;
    if (this.tokenStorageService.getUser()) {
      this.isLoggedIn = true;
    }
    this.forgotPasswordForm = new FormGroup({
      username: new FormControl(null, ValidatorsModule.usernameValidators),
      email: new FormControl(null, ValidatorsModule.emailValidators)
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.forgotPassword(this.forgotPasswordForm)
    .subscribe(successful => {
      console.log(successful);
      if (successful) {
        this.router.navigate(['/email-sent']);
      }
      this.isDataValid = successful;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.errorService.print(err);
    });
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
