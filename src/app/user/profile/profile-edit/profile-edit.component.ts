import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../authentification/user.model';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../../authentification/token-storage.service';

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

  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.editPasswordActive = false;
    this.user = this.tokenStorageService.getUser();
    console.log(this.user);
    this.profileForm = new FormGroup({
      username: new FormControl(this.user.username, Validators.required),
      firstname: new FormControl(this.user.firstname, Validators.required),
      lastname: new FormControl(this.user.lastname, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      company: new FormControl(this.user.company, Validators.required)
    });
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(),
      newPassword: new FormControl(),
      newPasswordCheck: new FormControl()
    });
  }

  onEditPassword(): void {
    this.editPasswordActive = !this.editPasswordActive;
  }

  onSubmit(): void {
    console.log('speichern');
    console.log(this.profileForm.valid);
  }

  onBackToProfile(): boolean {
    if (this.profileForm.touched) {
      if (!(confirm('Änderungen verwerfen?'))) {
        return false;
      }
    }
    this.router.navigate(['/profile']);
  }
}
