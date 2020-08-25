import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = localStorage.getItem('login') === 'true';
  }

  onLogout() {
    if (!(confirm('Wollen Sie sich wirklich ausloggen?'))) return false;
    localStorage.setItem('login', 'false');
    this.router.navigate(['/logout']);
  }

}
