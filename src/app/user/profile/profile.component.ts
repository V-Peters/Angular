import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '../../authentification/token-storage.service';
import { User } from '../user.model';
import { AuthService } from '../../authentification/auth.service';
import { AppComponent } from '../../app.component';
import { ErrorService } from '../../error/error-service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  isLoading: boolean;
  isAdmin: boolean;
  user: User;
  role: string;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private userService: UserService, private authService: AuthService, private appComponent: AppComponent, private errorService: ErrorService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isAdmin = this.tokenStorageService.isAdmin();
    this.user = this.tokenStorageService.getUser();
    this.role = this.isAdmin ? 'Administrator' : 'Standardbenutzer';
    this.isLoading = false;
  }

  onEditUser(): void {
    this.router.navigate(['profile/editUser']);
  }

  onDelete(): void {
    const password = prompt('Sind Sie sicher, dass Sie Ihr Profil löschen möchten?', 'Ihr Passwort');
    this.userService.deleteUser(password)
      .subscribe(successful => {
        if (successful) {
          this.authService.logout();
          this.appComponent.showSnackbar('Ihr Profil wurde erfolgreich gelöscht');
        } else {
          this.appComponent.showSnackbar('Das eingegebene Passwort ist falsch');
        }
      }, err => {
        this.errorService.print(err);
      });
  }

  onEditPassword(): void {
    this.router.navigate(['profile/editPassword']);
  }
}
