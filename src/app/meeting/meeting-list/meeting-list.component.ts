import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Meeting } from '../meeting.model'
import { MeetingService } from "../meeting.service";
import { TokenStorageService } from 'src/app/authentification/token-storage.service';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit {
  showMeetings = false;
  isAdmin = false;
  meetings: Meeting[];
  signupValues = {};
  initialDisplayValues = {};
  initialSignupValues = {};
  isDifferent = false;
  isLoading = false;
  
  constructor(private router: Router, private meetingService: MeetingService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    if (!this.tokenStorageService.getUser()) {
      console.log("ausgeloggt");
      this.showMeetings = false;
    } else {
      console.log("eingeloggt");
      this.showMeetings = true;
      this.isLoading = true;
      this.isAdmin = false;

      this.meetingService.getMeetings()
      .subscribe(tempMeetings => {
        this.isLoading = false;
        this.meetings = tempMeetings;
        this.isDifferent = false;
        
        if (this.tokenStorageService.getUser().roles[0] == 'ROLE_ADMIN') {
          this.isAdmin = true;
        } else {
          this.initUser();
        }
        this.initAdmin();
      });
    }
  }

  initAdmin() {
    this.meetings.forEach(meeting => {
      this.initialDisplayValues[meeting.id] = meeting.display;
    });
  }

  initUser() {
    this.meetingService.getMeetingsForUser(this.tokenStorageService.getUser().id)
    .subscribe(tempMeetingUsers => {
      this.meetings.forEach(tempMeeting => {
        this.signupValues[tempMeeting.id] = false;
        tempMeetingUsers.forEach(tempMeetinUser => {
          if (tempMeeting.id == tempMeetinUser.idMeeting) {
            this.signupValues[tempMeeting.id] = true;
          }
        });
      });
      this.meetings.forEach(meeting => {
        this.initialSignupValues[meeting.id] = this.signupValues[meeting.id];
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

  onChangeSignup(i: number) {
    this.signupValues[i] = !this.signupValues[i];
    this.checkForUpdates();
  }

  checkForUpdates() {
    for(let meeting of this.meetings) {
      this.isDifferent = false;
      if (meeting.display != this.initialDisplayValues[meeting.id] || this.signupValues[meeting.id] != this.initialSignupValues[meeting.id]) {
        this.isDifferent = true;
        break;
      }
    }
  }

  onSaveChanges() {
    if (this.tokenStorageService.getUser().roles[0] == 'ROLE_ADMIN') {
      let changedDisplay = {};

      for (let meeting of this.meetings) {
        if (meeting.display != this.initialDisplayValues[meeting.id]) {
          changedDisplay[meeting.id] = meeting.display;
        }
      }
      this.meetingService.updateDisplay(changedDisplay)
      .subscribe(() => {
        this.ngOnInit();
      });
    } else {
      this.meetingService.updateSignup(this.signupValues, this.tokenStorageService.getUser().id)
      .subscribe(() => {
        this.ngOnInit();
      });
    }
  }

  onShowParticipants(id: number) {
    this.router.navigate(['/participants/list/' + id])
  }

}
