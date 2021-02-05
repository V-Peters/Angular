import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ErrorService } from '../../error/error-service';
import { AppComponent } from '../../app.component';
import { ValidatorsModule } from '../../validation/validators.module';
import { ValidationErrorMessagesModule } from '../../validation/validation-error-messages.module';
import { UserService } from '../../user/user.service';

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
  usernameError: string;
  emailError: string;

  constructor(private router: Router, private authService: AuthService, private userService: UserService, private tokenStorageService: TokenStorageService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    ValidationErrorMessagesModule.usernameError.subscribe(errorMessage => {
      this.usernameError = errorMessage;
    });
    ValidationErrorMessagesModule.emailError.subscribe(errorMessage => {
      this.emailError = errorMessage;
    });
    this.isLoading = false;
    this.isDataValid = true;
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    this.forgotPasswordForm = new FormGroup({
      username: new FormControl(null, ValidatorsModule.usernameValidators),
      email: new FormControl(null, ValidatorsModule.emailValidators)
    });
    this.changedUsername();
    this.changedEmail();
  }

  changedUsername(): void {
    ValidationErrorMessagesModule.changedUsername(this.forgotPasswordForm, this.userService, this.errorService);
  }

  changedEmail(): void {
    ValidationErrorMessagesModule.changedEmail(this.forgotPasswordForm, this.userService, this.errorService, '');
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.forgotPassword(this.forgotPasswordForm)
    .subscribe(successful => {
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
