import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { Meeting } from './meeting.model'
import { TokenStorageService } from '../authentification/token-storage.service';
import { MeetingUser } from './meetingUser.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {}

  getMeetings() {
    const url = this.tokenStorageService.getUser().roles[0] == 'ROLE_ADMIN' ? 'http://localhost:8080/meetings/listAdmin' : 'http://localhost:8080/meetings/listUser';
    return this.http
    .get<Meeting[]>(
      url
    );
  }

  getMeeting(id: number) {
    return this.http
    .get<Meeting>(
      'http://localhost:8080/meetings?id=' + id
    );
  }

  saveMeeting(meeting: Meeting) {
    return this.http
    .post<Meeting>(
      'http://localhost:8080/meetings',
      meeting
    );
  }

  deleteMeeting(id: number) {
    return this.http
    .delete(
      'http://localhost:8080/meetings?id=' + id
    );
  }

  updateDisplay(display: {}) {
    return this.http
    .post<boolean[]>(
      'http://localhost:8080/meetings/updateDisplay',
      display
    );
  }

  listParticipants(id: number) {
    return this.http
    .get(
      'http://localhost:8080/meetingUser/listParticipants?id=' + id
    );
  }

  getMeetingsForUser(id: number) {
    return this.http
    .get<MeetingUser[]>(
      'http://localhost:8080/meetingUser/getMeetingsForUser?id=' + id
    );
  }

  updateSignup(signup: {}, userId: number) {
    return this.http
    .post<boolean[]>(
      'http://localhost:8080/meetingUser/updateSignup?userId=' + userId,
      signup
    );
  }
}