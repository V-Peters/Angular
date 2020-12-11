import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService implements OnInit {
  private USER_KEY = 'auth-user';

  currentUser = new EventEmitter<any>();

  constructor() { }

  // tslint:disable-next-line:contextual-lifecycle
  ngOnInit(): void {
    this.currentUser.emit(this.getUser());
  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public getToken(): string {
    if (this.getUser()){
      return this.getUser().accessToken;
    }
    return null;
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(this.USER_KEY);
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.emit(user);
  }

  public getUser(): User {
    return JSON.parse(sessionStorage.getItem(this.USER_KEY));
  }

  public isAdmin(): boolean {
    return this.getUser().role === 'ROLE_ADMIN';
  }

  public isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
