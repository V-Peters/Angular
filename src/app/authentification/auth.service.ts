import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { environment } from '../../environments/environment';
import { LoginResponse } from './login-response.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_API = environment.CROSS_ORIGIN_AUTH;

  constructor(private http: HttpClient, private router: Router, private tokenStorageService: TokenStorageService, private appComponent: AppComponent) { }

  login(loginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.AUTH_API + 'login', {
      usernameOrEmail: loginForm.value.usernameOrEmail,
      password: loginForm.value.password,
    }, httpOptions)
      .pipe(map(body => {
      return new LoginResponse(body.type, body.token, body.role, body.id, body.username, body.firstname, body.lastname, body.email, body.company);
    }));
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.tokenStorageService.currentUser.emit(null);
    this.router.navigate(['/login']);
    this.appComponent.showSnackbar('Sie wurden erfolgreich ausgeloggt');
  }

  register(registerForm): Observable<boolean> {
    return this.http.post<boolean>(this.AUTH_API + 'register', {
      username: registerForm.value.username,
      password: registerForm.value.password,
      passwordCheck: registerForm.value.passwordCheck,
      firstname: registerForm.value.firstname,
      lastname: registerForm.value.lastname,
      email: registerForm.value.email,
      company: registerForm.value.company
    }, httpOptions);
  }

  forgotPassword(forgotPasswordForm): Observable<boolean> {
    return this.http.post<boolean>(this.AUTH_API + 'forgotPassword', {
      username: forgotPasswordForm.value.username,
      email: forgotPasswordForm.value.email,
    }, httpOptions);
  }

  setNewPassword(setNewPasswordForm, rps: string): Observable<boolean> {
    return this.http.post<boolean>(this.AUTH_API + 'setNewPassword', {
      password: setNewPasswordForm.value.password,
      passwordCheck: setNewPasswordForm.value.passwordCheck
    }, {
      headers: {rps}
    });
  }
}
