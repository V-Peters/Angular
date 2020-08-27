import { Component, OnInit } from '@angular/core';

import { Meeting } from './meeting/meeting.model'

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit {
  showMeetings = false;
  // get from backend later
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
  initialDisplayValues: boolean[] = [];
  isDisplayDifferent = false;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('login') === 'true') {
      this.showMeetings = true;
    }
    for (let i = 0; i < this.meetings.length; i++) {
      this.initialDisplayValues[i] = this.meetings[i].display;
    }
  }

  onAddMeeting() {
    console.log('Veranstaltung hinzufügen geklickt.')
  }

  onChangeDisplay(i: number) {
    this.meetings[i].display = !this.meetings[i].display;
    this.checkForUpdates();
  }

  checkForUpdates() {
    for (let i = 0; i < this.meetings.length; i++) {
      if (this.meetings[i].display != this.initialDisplayValues[i]) {
        this.isDisplayDifferent = true;
        break;
      }
      this.isDisplayDifferent = false;
    }
  }

  onSaveDisplayChanges() {
    console.log('Änderungen Übernehmen geklickt.')
  }

}
