import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../authentification/auth.service';
import { TokenStorageService } from '../authentification/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {
  currentUser;
  loggedIn: boolean;
  firstname: string;
  lastname: string;
  isLoggedIn = false;
  username: string;

  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.isLoggedIn = !!this.currentUser;

    this.tokenStorageService.currentUser.subscribe(tempUser => {
      this.currentUser = tempUser;
      this.isLoggedIn = !!this.currentUser;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('header onChanges');
    
  }
  ngOnDestroy(){
    this.tokenStorageService.currentUser.unsubscribe();
  }

  onLogout() {
    this.tokenStorageService.signOut();
    this.tokenStorageService.currentUser.emit(null);
    this.router.navigate(["/login"]);
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.tokenStorageService.currentUser.emit(null);
    this.router.navigate(["/login"]);
  }

}
