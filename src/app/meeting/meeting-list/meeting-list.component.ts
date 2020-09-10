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
  initialDisplayValues = {};
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
      this.meetings.forEach(meeting => {
        this.initialDisplayValues[meeting.id] = meeting.display;
      });
    });
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
    for(let meeting of this.meetings) {
      if (meeting.display != this.initialDisplayValues[meeting.id]) {
        this.isDisplayDifferent = true;
        break;
      }
      this.isDisplayDifferent = false;
    }
  }

  onSaveDisplayChanges() {
    console.log('Änderungen Übernehmen geklickt.')

    let changedDisplay: boolean[] = new Array<boolean>(this.meetings.length);
    for (let i = 0; i < this.meetings.length; i++) {
      changedDisplay[i] = this.meetings[i].display;
    }

    console.log('array erstellt');
    
    this.meetingService.updateDisplay(changedDisplay)
    .subscribe(() => {
      console.log('Änderungen wurden gespeichert');
      this.ngOnInit();
    })
  }

}
