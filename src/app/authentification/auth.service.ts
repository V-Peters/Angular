import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

const AUTH_API = 'http://localhost:8080/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

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
}
