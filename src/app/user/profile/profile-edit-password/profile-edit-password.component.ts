import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../authentification/token-storage.service';
import { ErrorService } from '../../../error/error-service';
import { AppComponent } from '../../../app.component';
import { ValidatorsModule } from '../../../validation/validators.module';
import { ValidationErrorMessagesModule } from '../../../validation/validation-error-messages.module';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit-password.component.html'
})
export class ProfileEditPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  isLoading: boolean;
  passwordError: string;
  newPasswordError: string;
  newPasswordCheckError: string;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private userService: UserService, private errorService: ErrorService, private appComponent: AppComponent) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, ValidatorsModule.passwordValidators),
      password: new FormControl(null, ValidatorsModule.passwordValidators),
      passwordCheck: new FormControl(null, ValidatorsModule.passwordValidators)
    });
    this.isLoading = false;
    this.changedPassword();
    this.changedNewPassword();
    this.changedNewPasswordCheck();
  }

  changedPassword(): void {
    this.passwordError = ValidationErrorMessagesModule.changedCurrentPassword(this.passwordForm);
  }

  changedNewPassword(): void {
    this.newPasswordError = ValidationErrorMessagesModule.changedPassword(this.passwordForm);
    this.changedNewPasswordCheck();
  }

  changedNewPasswordCheck(): void {
    this.newPasswordCheckError = ValidationErrorMessagesModule.changedPasswordCheck(this.passwordForm);
  }

  onSubmit(): boolean {
    if (confirm('Änderungen wirklich übernehmen?')) {
      this.savePasswordChanges();
    } else {
      return false;
    }
  }

  savePasswordChanges(): void {
    this.userService.editPassword(this.passwordForm)
      .subscribe(successful => {
        if (successful) {
          this.appComponent.showSnackbar('Ihr Passwort wurde erfolgreich überarbeitet');
          this.navigateToProfile();
        } else {
          this.appComponent.showSnackbar('Das eingegebene Passwort ist falsch');
        }
      }, err => {
        this.errorService.print(err);
      });
  }

  onBackToProfile(): boolean {
    if (this.passwordForm.touched) {
      if (!(confirm('Änderungen verwerfen?'))) {
        return false;
      }
    }
    this.navigateToProfile();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
