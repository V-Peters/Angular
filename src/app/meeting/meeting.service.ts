import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Meeting } from './meeting.model';
import { MeetingUser } from './meetingUser.model';
import { User } from '../authentification/user.model';

const MEETING_URL = 'http://localhost:8080/meetings/';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

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

  deleteMeeting(id: number): Observable<Meeting> {
    return this.http
    .delete<Meeting>(
      MEETING_URL + id
    );
  }

  updateDisplay(display: {}): Observable<boolean[]> {
    return this.http
    .post<boolean[]>(
      MEETING_URL + 'updateDisplay',
      display
    );
  }

  listParticipants(id: number): Observable<User[]> {
    return this.http
    .get<User[]>(
      MEETING_URL + 'listParticipants/' + id
    );
  }

  getMeetingsSignedUpToForUser(id: number): Observable<MeetingUser[]> {
    return this.http
    .get<MeetingUser[]>(
      MEETING_URL + 'getMeetingsSignedUpToForUser/' + id
    );
  }

  updateSignup(signup: {}, userId: number): Observable<boolean[]> {
    return this.http
    .post<boolean[]>(
      MEETING_URL + 'updateSignup/' + userId,
      signup
    );
  }
}
