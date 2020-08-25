import { Component, OnInit } from '@angular/core';

import { Meeting } from './meeting/meeting.model'

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit {
  showMeetings = false;
  meetings: Meeting[] = [
    new Meeting(
      'Testname',
      '10.10.2020',
      '16:45 Uhr',
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

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('login') === 'true') {
      this.showMeetings = true;
    }
  }

  onAddMeeting() {
    console.log('Veranstaltung hinzufügen geklickt.')
  }

}
