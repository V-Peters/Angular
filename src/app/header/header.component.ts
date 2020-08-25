import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean;

  constructor() { }

  ngOnInit(): void {
    this.loggedIn = localStorage.getItem('login') === 'true';
  }

  onLogout() {
    localStorage.setItem('login', 'false');
  }

}
