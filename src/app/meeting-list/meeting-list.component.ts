import { Component, OnInit } from '@angular/core';

import { Meeting } from './meeting/meeting.model'

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit {
  private meetings: Meeting[] = [
    new Meeting(
      'Name1',
      'Datum1',
      'Uhrzeit1',
      true
    ),
    new Meeting(
      'Name2',
      'Datum2',
      'Uhrzeit2',
      true
    ),
    new Meeting(
      'Name3',
      'Datum3',
      'Uhrzeit3',
      false
    )
  ];

  showMeetings = false;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('login') === 'true') {
      this.showMeetings = true;
    }
  }

}
