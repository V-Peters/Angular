import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../authentification/token-storage.service';
import { User } from 'src/app/authentification/user.model';
import { Router } from '@angular/router';
import {AuthService} from '../../authentification/auth.service';
import {AppComponent} from '../../app.component';
import {ErrorService} from '../../error/error-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  isLoading: boolean;
  isAdmin: boolean;
  user: User;
  role: string;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private authService: AuthService, private appComponent: AppComponent, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isAdmin = this.tokenStorageService.isAdmin();
    this.user = this.tokenStorageService.getUser();
    this.role = this.isAdmin ? 'Administrator' : 'Standardbenutzer';
    this.isLoading = false;
  }

  onEdit(): void {
    this.router.navigate(['profile/edit']);
  }

  onDelete(): void {
    const password = prompt('Sind Sie sicher, dass Sie Ihr Profil löschen möchten?', 'Ihr Passwort');
    this.authService.deleteUser(password)
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
    console.log(password);

    // if (prompt('Sind Sie sicher, dass Sie Ihr Profil löschen möchten?')) {
    //   console.log('gelöscht');
    // }
  }
}
