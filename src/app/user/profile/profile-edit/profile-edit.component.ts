import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../authentification/user.model';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../../authentification/token-storage.service';
import {AuthService} from '../../../authentification/auth.service';
import {ErrorService} from '../../../error/error-service';

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
  emailError: string;
  passwordError: string;
  newPasswordError: string;
  newPasswordCheckError: string;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private authService: AuthService, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.editPasswordActive = false;
    this.user = this.tokenStorageService.getUser();
    this.profileForm = new FormGroup({
      firstname: new FormControl(this.user.firstname, Validators.required),
      lastname: new FormControl(this.user.lastname, Validators.required),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      company: new FormControl(this.user.company, Validators.required)
    });
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),
      newPasswordCheck: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(60)])
    });
    this.isLoading = false;
  }

  onEditPassword(): void {
    this.passwordForm.reset();
    this.editPasswordActive = !this.editPasswordActive;
  }

  onSubmit(): boolean {
    if ((confirm('Änderungen wirklich übernehmen?'))) {
      if (this.editPasswordActive) {
        this.checkPasswordAndSaveChanges();
      } else {
        this.saveChanges();
      }
    } else {
      return false;
    }
  }

  checkPasswordAndSaveChanges(): void {
    console.log('checkPasswordAndSaveChanges');
    this.authService.checkPassword(this.tokenStorageService.getUser().id, this.passwordForm.value.currentPassword)
    .subscribe(successful => {
      console.log(successful);
      if (successful) {
        this.saveChanges();
      } else {
        console.log('Falsches Passwort');
      }
    }, err => {
      this.errorService.print(err);
    });
  }

  saveChanges(): void {
    console.log('saveChanges');
    this.authService.changeUser(this.profileForm, this.passwordForm)
    .subscribe(successful => {
      console.log(successful);
      if (successful) {
        this.updateUserToken();
        this.tokenStorageService.saveUser(this.user);
      }
      this.navigateToProfile();
    }, err => {
      this.errorService.print(err);
    });
  }

  updateUserToken(): void {
    const tempUser = this.tokenStorageService.getUser();
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

  changedEmail(): void {
    this.emailAlreadyExists = false;
    this.emailError = 'Bitte geben Sie eine gültige E-Mail ein.';
    if (this.profileForm.controls.email.valid) {
      this.authService.checkIfEmailExists(this.profileForm.value.email)
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

  changedPassword(): void {
    this.passwordError = 'Bitte geben Sie ein gültiges Passwort ein';
    this.changedNewPasswordCheck();
  }

  changedNewPassword(): void {
    this.newPasswordError = 'Bitte geben Sie ein gültiges Passwort ein';
    this.changedNewPasswordCheck();
  }

  changedNewPasswordCheck(): void {
    if (this.passwordForm.value.password !== this.passwordForm.value.passwordCheck) {
      this.newPasswordCheckError = 'Die beiden Passwörter stimmen nicht überein';
    } else {
      this.newPasswordCheckError = '';
    }
  }
}
