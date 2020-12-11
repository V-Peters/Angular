import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_API = 'https://meeting-user-server.herokuapp.com/user/';

  constructor(private http: HttpClient, private router: Router, private tokenStorageService: TokenStorageService, private appComponent: AppComponent) { }

  checkIfUsernameExists(username: string): Observable<boolean> {
    return this.http.post<boolean>(this.AUTH_API + 'checkIfUsernameExists',
    username);
  }

  checkIfEmailExists(username: string): Observable<boolean> {
    return this.http.post<boolean>(this.AUTH_API + 'checkIfEmailExists',
    username);
  }

  login(user): Observable<User> {
    return this.http.post<User>(this.AUTH_API + 'login', {
      username: user.value.username,
      password: user.value.password,
      firstname: 'empty',
      lastname: 'empty',
      email: 'empty@empty.com',
      company: 'empty'
    }, httpOptions);
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.tokenStorageService.currentUser.emit(null);
    this.router.navigate(['/login']);
    this.appComponent.showSnackbar('Sie wurden erfolgreich ausgeloggt');
  }

  register(user): Observable<any> {
    return this.http.post<any>(this.AUTH_API + 'register', {
      username: user.value.username,
      password: user.value.password,
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email,
      company: user.value.company
    }, httpOptions);
  }

  changeUser(user, password): Observable<boolean> {
    return this.http.post<boolean>(this.AUTH_API + 'changeUser', {
      id: this.tokenStorageService.getUser().id,
      currentPassword: password.value.currentPassword,
      newPassword: password.value.password,
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email,
      company: user.value.company
    }, {
      headers: {password: password.value.currentPassword + ''}
    });
  }

  deleteUser(password: string): Observable<boolean> {
    return this.http.delete<boolean>(this.AUTH_API, {
      headers: {password}
    });
  }
}
