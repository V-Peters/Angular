import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TokenStorageService } from '../../token-storage.service';
import { ValidatorsModule } from '../../../validation/validators.module';
import { ErrorService } from '../../../error/error-service';
import { AuthService } from '../../auth.service';
import { AppComponent } from '../../../app.component';
import { ValidationErrorMessagesModule } from '../../../validation/validation-error-messages.module';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['../../auth-form.component.css']
})
export class SetNewPasswordComponent implements OnInit {
  isLoading: boolean;
  isLoggedIn: boolean;
  isDataValid: boolean;
  setNewPasswordForm: FormGroup;
  passwordError: string;
  passwordCheckError: string;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private authService: AuthService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isDataValid = true;
    if (this.tokenStorageService.getUser()) {
      this.isLoggedIn = true;
    }
    this.setNewPasswordForm = new FormGroup({
      username: new FormControl(null, ValidatorsModule.usernameValidators),
      password: new FormControl(null, ValidatorsModule.passwordValidators),
      passwordCheck: new FormControl(null, ValidatorsModule.passwordValidators)
    });
    this.changedPassword();
    this.changedPasswordCheck();
  }

  changedPassword(): void {
    this.passwordError = ValidationErrorMessagesModule.changedPassword(this.setNewPasswordForm);
    this.changedPasswordCheck();
  }

  changedPasswordCheck(): void {
    this.passwordCheckError = ValidationErrorMessagesModule.changedPasswordCheck(this.setNewPasswordForm);
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.setNewPassword(this.setNewPasswordForm)
      .subscribe(successful => {
        if (successful) {
          this.router.navigate(['/login']);
          this.appComponent.showSnackbar('Ihr neues Passwort wurde gesetzt, loggen Sie sich direkt ein.');
        }
        this.isDataValid = successful;
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.errorService.print(err);
      });
  }

}
