import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '../authentification/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(private router: Router, private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onList(): void {
    this.router.navigate(['/meeting/list']);
  }
}
