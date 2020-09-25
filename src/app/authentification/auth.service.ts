import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      username: user.value.username,
      password: user.value.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      username: user.value.username,
      password: user.value.password,
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email,
      company: user.value.company
    }, httpOptions);
  }
}
