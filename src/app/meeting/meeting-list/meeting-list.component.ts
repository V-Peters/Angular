import { Component, OnInit } from '@angular/core';

import { Meeting } from '../meeting.model'
import { MeetingService } from "../meeting.service";
import { Router } from '@angular/router';

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
  isLoading = false;
  
  constructor(private router: Router, private meetingService: MeetingService) { }

  ngOnInit(): void {
    if (localStorage.getItem('login') === 'true') {
      this.showMeetings = true;
    }

    this.isLoading = true;
    this.meetingService.getMeetings()
    .subscribe(tempMeetings => {
      this.isLoading = false;
      this.meetings = tempMeetings;
      for (let i = 0; i < this.meetings.length; i++) {
        this.initialDisplayValues[i] = this.meetings[i].display;
        this.meetings[i].date = this.meetings[i].datetime.substring(8, 10) + "." +  this.meetings[i].datetime.substring(5, 7) + "." +  this.meetings[i].datetime.substring(0, 4);
        this.meetings[i].time = this.meetings[i].datetime.substring(11, 16) + " Uhr";
      }
    });
    // this.meetings = this.meetingService.getMeetings();

  }

  onAddMeeting() {
    console.log('Veranstaltung hinzufügen geklickt.')
    this.router.navigate(['/meeting/add']);
  }

  onEditMeeting(id: number) {
    console.log('edit: ' + id);
    this.router.navigate(['/meeting/edit/' + id]);
  }

  onDeleteMeeting(id: number) {
    console.log(id);
    
    if (confirm('Sind Sie sicher, dass Sie diese Veranstaltung löschen möchten?')){
      this.meetingService.deleteMeeting(id)
      .subscribe(() => {
        console.log('Meeting mit der id ' + id + ' wurde gelöscht.');
        this.ngOnInit();
      });
    }
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
