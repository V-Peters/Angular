import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '../authentification/token-storage.service';
import { User } from '../authentification/user.model';
import {AuthService} from '../authentification/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  isLoggedIn: boolean;
  logo: string;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.logo = '../../favicon.ico';
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
    this.authService.logout();
  }
}
