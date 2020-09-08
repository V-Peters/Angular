import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { Meeting } from './meeting.model'

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  private meetings: Meeting[] = [];
  private meeting: Meeting;

  constructor(private http: HttpClient) {}

  getMeetings() {
    return this.http
    .get<Meeting[]>(
      'http://localhost:8080/meeting/list'
    )
    .pipe(
      tap(tempMeetings => {
        this.meetings = tempMeetings;
        console.log("getMeetings:");
        console.log(tempMeetings);
      })
    );
  }

  getMeeting(id: number) {
    return this.http
    .get<Meeting>(
      'http://localhost:8080/meeting?id=' + id
    )
    .pipe(
      tap(tempMeeting => {
        this.meeting = tempMeeting;
        console.log("getMeeting:");
        console.log(tempMeeting);
      })
    );
  }

  saveMeeting(meeting: Meeting) {
    console.log(meeting);
    return this.http
    .post<Meeting>(
      'http://localhost:8080/meeting',
      meeting
    );
  }

  deleteMeeting(id: number) {
    return this.http
    .delete(
      'http://localhost:8080/meeting?id=' + id
    );
  }
}