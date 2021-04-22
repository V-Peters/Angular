import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Author } from './author.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_API = environment.CROSS_ORIGIN_USER;

  constructor(private http: HttpClient) { }

  checkIfUsernameExists(username: string): Observable<boolean> {
    return this.http.post<boolean>(this.USER_API + 'checkIfUsernameExists',
    username);
  }

  checkIfEmailExists(username: string): Observable<boolean> {
    return this.http.post<boolean>(this.USER_API + 'checkIfEmailExists',
    username);
  }

  editUser(userForm): Observable<boolean> {
    return this.http.post<boolean>(this.USER_API + 'editUser', {
      firstname: userForm.value.firstname,
      lastname: userForm.value.lastname,
      email: userForm.value.email,
      company: userForm.value.company
    });
  }

  editPassword(passwordForm): Observable<boolean> {
    return this.http.post<boolean>(this.USER_API + 'editPassword', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.password,
      newPasswordCheck: passwordForm.value.passwordCheck
    });
  }

  deleteUser(password: string): Observable<boolean> {
    return this.http.delete<boolean>(this.USER_API, {
      headers: {password}
    });
  }

  getAuthor(id: number): Observable<Author> {
    return this.http.get<Author>(this.USER_API + 'author/' + id);
  }
}
