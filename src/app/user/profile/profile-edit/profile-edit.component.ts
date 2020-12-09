import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../../authentification/user.model';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../../authentification/token-storage.service';
import {AuthService} from '../../../authentification/auth.service';
import {ErrorService} from '../../../error/error-service';
import {AppComponent} from '../../../app.component';
import {ValidatorsModule} from '../../../validation/validators.module';
import {ValidationErrorMessagesModule} from '../../../validation/validation-error-messages.module';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: User;
  isLoading: boolean;
  editPasswordActive: boolean;
  emailAlreadyExists: boolean;
  firstnameError: string;
  lastnameError: string;
  emailError: string;
  companyError: string;
  passwordError: string;
  newPasswordError: string;
  newPasswordCheckError: string;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private authService: AuthService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    ValidationErrorMessagesModule.emailError.subscribe(errorMessage => {
      this.emailError = errorMessage;
      this.emailAlreadyExists = this.emailError === 'Diese E-Mail ist bereits vergeben.';
    });
    this.isLoading = true;
    this.editPasswordActive = false;
    this.user = this.tokenStorageService.getUser();
    this.profileForm = new FormGroup({
      firstname: new FormControl(this.user.firstname, ValidatorsModule.firstnameValidators),
      lastname: new FormControl(this.user.lastname, ValidatorsModule.lastnameValidators),
      email: new FormControl(this.user.email, ValidatorsModule.emailValidators),
      company: new FormControl(this.user.company, ValidatorsModule.companyValidators)
    });
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, ValidatorsModule.passwordValidators),
      password: new FormControl(null, ValidatorsModule.passwordValidators),
      passwordCheck: new FormControl(null, ValidatorsModule.passwordValidators)
    });
    this.isLoading = false;
    this.changedFirstname();
    this.changedLastname();
    this.changedEmail();
    this.changedCompany();
    this.changedPassword();
    this.changedNewPassword();
    this.changedNewPasswordCheck();
  }

  changedFirstname(): void {
    this.firstnameError = ValidationErrorMessagesModule.changedFirstname(this.profileForm);
  }

  changedLastname(): void {
    this.lastnameError = ValidationErrorMessagesModule.changedLastname(this.profileForm);
  }

  changedEmail(): void {
    ValidationErrorMessagesModule.changedEmail(this.profileForm, this.authService, this.errorService, this.tokenStorageService.getUser().email);
  }

  changedCompany(): void {
    ValidationErrorMessagesModule.changedCompany(this.profileForm);
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

  onEditPassword(): void {
    this.passwordForm.reset();
    this.editPasswordActive = !this.editPasswordActive;
  }

  onSubmit(): boolean {
    if (confirm('Änderungen wirklich übernehmen?')) {
      this.saveChanges();
    } else {
      return false;
    }
  }

  saveChanges(): void {
    this.authService.changeUser(this.profileForm, this.passwordForm)
    .subscribe(successful => {
      if (successful) {
        this.updateUserToken();
        this.tokenStorageService.saveUser(this.user);
        this.appComponent.showSnackbar('Ihr Profil wurde erfolgreich überarbeitet');
        this.navigateToProfile();
      } else {
        this.appComponent.showSnackbar('Das eingegebene Passwort ist falsch');
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
  }

  onBackToProfile(): boolean {
    if (this.profileForm.touched || this.passwordForm.touched) {
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
