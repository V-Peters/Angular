import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../user.model';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../authentification/token-storage.service';
import { ErrorService } from '../../../error/error-service';
import { AppComponent } from '../../../app.component';
import { ValidatorsModule } from '../../../validation/validators.module';
import { ValidationErrorMessagesModule } from '../../../validation/validation-error-messages.module';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit-user.component.html'
})
export class ProfileEditUserComponent implements OnInit {
  isLoading: boolean;
  profileForm: FormGroup;
  emailAlreadyExists: boolean;
  firstnameError: string;
  lastnameError: string;
  emailError: string;
  companyError: string;

  private user: User;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private userService: UserService, private errorService: ErrorService, private appComponent: AppComponent) {
  }

  ngOnInit(): void {
    ValidationErrorMessagesModule.emailError.subscribe(errorMessage => {
      this.emailError = errorMessage;
      this.emailAlreadyExists = this.emailError === 'Diese E-Mail ist bereits vergeben.';
    });
    this.isLoading = true;
    this.user = this.tokenStorageService.getUser();
    this.profileForm = new FormGroup({
      firstname: new FormControl(this.user.firstname, ValidatorsModule.firstnameValidators),
      lastname: new FormControl(this.user.lastname, ValidatorsModule.lastnameValidators),
      email: new FormControl(this.user.email, ValidatorsModule.emailValidators),
      company: new FormControl(this.user.company, ValidatorsModule.companyValidators)
    });
    this.isLoading = false;
    this.changedFirstname();
    this.changedLastname();
    this.changedEmail();
    this.changedCompany();
  }

  changedFirstname(): void {
    this.firstnameError = ValidationErrorMessagesModule.changedFirstname(this.profileForm);
  }

  changedLastname(): void {
    this.lastnameError = ValidationErrorMessagesModule.changedLastname(this.profileForm);
  }

  changedEmail(): void {
    ValidationErrorMessagesModule.changedEmail(this.profileForm, this.userService, this.errorService, this.tokenStorageService.getUser().email);
  }

  changedCompany(): void {
    this.companyError = ValidationErrorMessagesModule.changedCompany(this.profileForm);
  }

  onSubmit(): boolean {
    if (confirm('Änderungen wirklich übernehmen?')) {
      this.saveUserChanges();
    } else {
      return false;
    }
  }

  saveUserChanges(): void {
    this.userService.editUser(this.profileForm)
      .subscribe(successful => {
        if (successful) {
          this.updateUserToken();
          this.appComponent.showSnackbar('Ihr Profil wurde erfolgreich überarbeitet');
          this.navigateToProfile();
        } else {
          this.appComponent.showSnackbarError();
        }
      }, err => {
        this.errorService.print(err);
      });
  }

  updateUserToken(): void {
    this.user.firstname = this.profileForm.value.firstname;
    this.user.lastname = this.profileForm.value.lastname;
    this.user.email = this.profileForm.value.email;
    this.user.company = this.profileForm.value.company;
    this.tokenStorageService.saveUser(this.user);
  }

  onBackToProfile(): boolean {
    if (this.profileForm.touched) {
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
