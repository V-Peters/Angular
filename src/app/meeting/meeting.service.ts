import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Meeting } from './meeting.model';
import { MeetingUser } from './meetingUser.model';
import {User} from '../authentification/user.model';

const MEETING_URL = 'https://meeting-user-server.herokuapp.com/meetings/';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  isLoading: boolean;
  meetings: Meeting[];
  meetingsExists: boolean;
  isLoggedIn: boolean;

  constructor(private http: HttpClient) {}

  getMeetings(): Observable<Meeting[]> {
    return this.http
    .get<Meeting[]>(
      MEETING_URL
    );
  }

  getMeeting(id: number): Observable<Meeting> {
    return this.http
    .get<Meeting>(
      MEETING_URL + id
    );
  }

  saveMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http
    .post<Meeting>(
      MEETING_URL,
      meeting
    );
  }

  deleteMeeting(meetingId: number): Observable<Meeting> {
    return this.http
    .delete<Meeting>(
      MEETING_URL + meetingId
    );
  }

  updateDisplay(display: {}): Observable<boolean> {
    return this.http
    .post<boolean>(
      MEETING_URL + 'updateDisplay',
      display
    );
  }

  updateSignup(signup: {}, userId: number): Observable<boolean[]> {
    return this.http
    .post<boolean[]>(
      MEETING_URL + 'updateSignup/' + userId,
      signup
    );
  }

  getUser(userId: number): Observable<User> {
    return this.http
    .get<User>(
      MEETING_URL + 'getUser/' + userId
    );
  }
}
