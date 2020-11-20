import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '../authentification/token-storage.service';
import { User } from '../authentification/user.model';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  isLoggedIn: boolean;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.isLoggedIn = !!this.currentUser;

    this.tokenStorageService.currentUser.subscribe(tempUser => {
      this.currentUser = tempUser;
      this.isLoggedIn = !!this.currentUser;
    });
  }

  ngOnDestroy(): void {
    this.tokenStorageService.currentUser.unsubscribe();
  }

  onLogout(): void {
    this.tokenStorageService.signOut();
    this.tokenStorageService.currentUser.emit(null);
    this.router.navigate(['/login']);
    this.appComponent.showSnackbar('Sie wurden erfolgreich ausgeloggt');
  }
}
