import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { Meeting } from './meeting/meeting.model'

@Injectable({
    providedIn: 'root'
})
export class MeetingService {

  private meetings: Meeting[] = [];

  constructor(private http: HttpClient) {}

  getMeetings() {
      return this.http
      .get<Meeting[]>(
        'http://localhost:8080/meeting/list'
      )
      .pipe(
          tap(tempMeetings => {
              this.meetings = tempMeetings;
              console.log(tempMeetings);
              
          })
      )
  }
}