import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { User } from '../user/user.model';
import { Auth } from './auth.model';
import { LoginResponse } from "./login-response.model";


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService implements OnInit {

  constructor() { }

  private AUTH_KEY = 'auth-user';
  private USER_KEY = 'user';

  currentAuth = new EventEmitter<any>();
  currentUser = new EventEmitter<any>();

  private static saveInSessionStorage(key: string, content: (User | Auth)): void {
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, JSON.stringify(content));
  }

  // tslint:disable-next-line:contextual-lifecycle
  ngOnInit(): void {
    this.currentAuth.emit(this.getAuth());
    this.currentUser.emit(this.getUser());
  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public getToken(): string {
    return this.getAuth() ? this.getAuth().token : null;
  }

  public saveLogin(loginResponse: LoginResponse): void {
    const auth: Auth = new Auth(loginResponse.type, loginResponse.token, loginResponse.role);
    const user: User = new User(loginResponse.id, loginResponse.username, loginResponse.firstname, loginResponse.lastname, loginResponse.email, loginResponse.company, loginResponse.role, []);
    this.saveAuth(auth);
    this.saveUser(user);
  }

  public saveUser(user: User): void {
    TokenStorageService.saveInSessionStorage(this.USER_KEY, user);
    this.currentUser.emit(user);
  }

  public saveAuth(auth: Auth): void {
    TokenStorageService.saveInSessionStorage(this.AUTH_KEY, auth);
    this.currentAuth.emit(auth);
  }

  public getAuth(): Auth {
    return JSON.parse(sessionStorage.getItem(this.AUTH_KEY));
  }

  public getUser(): User {
    return JSON.parse(sessionStorage.getItem(this.USER_KEY));
  }

  public isAdmin(): boolean {
    return this.getAuth().role === 'ROLE_ADMIN';
  }

  public isLoggedIn(): boolean {
    return !!this.getAuth();
  }
}
