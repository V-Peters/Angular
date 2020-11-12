import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { User } from './user.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService implements OnInit {

  currentUser = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.currentUser.emit(this.getUser());
  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.emit(user);
  }

  public getUser(): User {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }
}
