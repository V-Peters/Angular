import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import {TokenStorageService} from './token-storage.service';

const AUTH_API = 'https://meeting-user-server.herokuapp.com/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  checkIfUsernameExists(username: string): Observable<boolean> {
    return this.http.post<boolean>(AUTH_API + 'checkIfUsernameExists',
    username);
  }

  checkIfEmailExists(username: string): Observable<boolean> {
    return this.http.post<boolean>(AUTH_API + 'checkIfEmailExists',
    username);
  }

  login(user): Observable<User> {
    return this.http.post<User>(AUTH_API + 'login', {
      username: user.value.username,
      password: user.value.password,
      firstname: 'empty',
      lastname: 'empty',
      email: 'empty@empty.com',
      company: 'empty'
    }, httpOptions);
  }

  register(user): Observable<User> {
    return this.http.post<User>(AUTH_API + 'register', {
      username: user.value.username,
      password: user.value.password,
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email,
      company: user.value.company
    }, httpOptions);
  }

  changeUser(user, password): Observable<boolean> {
    return this.http.post<boolean>(AUTH_API + 'changeUser', {
      id: this.tokenStorageService.getUser().id,
      newPassword: password.value.newPassword,
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email,
      company: user.value.company
    });
  }

  checkPassword(id, password): Observable<boolean> {
    return this.http.post<boolean>(AUTH_API + 'checkPassword/' + id,
      password
    );
  }
}
