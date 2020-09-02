import { Component, OnInit } from '@angular/core';

import { Meeting } from './meeting/meeting.model'
import { MeetingService } from './meeting.service'

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit {
  showMeetings = false;
  meetings: Meeting[];
  initialDisplayValues: boolean[] = [];
  isDisplayDifferent = false;

  constructor(private meetingService: MeetingService) { }

  ngOnInit(): void {
    if (localStorage.getItem('login') === 'true') {
      this.showMeetings = true;
    }

    this.meetingService.getMeetings().subscribe(meetings => {
      this.meetings = meetings;
      for (let i = 0; i < this.meetings.length; i++) {
        this.initialDisplayValues[i] = this.meetings[i].display;
      }
    });
    // this.meetings = this.meetingService.getMeetings();

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
