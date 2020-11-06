import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Meeting } from '../meeting.model'
import { MeetingService } from "../meeting.service";
import { TokenStorageService } from '../../authentification/token-storage.service';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['../../loader.css']
})
export class MeetingListComponent implements OnInit {
  isLoading = true;
  isAdmin: boolean;
  meetings: Meeting[];
  signupValues = {};
  initialDisplayValues = {};
  initialSignupValues = {};
  isDifferent = false;
  meetingsExsits: boolean;
  
  constructor(private router: Router, private meetingService: MeetingService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getUser()) {
      this.isLoading = true;
      if (this.tokenStorageService.getUser().roles[0] == 'ROLE_ADMIN') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }

      this.meetingService.getMeetings()
      .subscribe(tempMeetings => {
        if (tempMeetings.length == 0) {
          this.meetingsExsits = false;
        } else {
          this.meetingsExsits = true;        
          this.isLoading = false;
          this.meetings = tempMeetings;
          this.isDifferent = false;
          
          if (!this.isAdmin) {
            this.initUser();
          }
          this.initAdmin();
        }
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
    this.router.navigate(['/meeting/add']);
  }

  onEditMeeting(id: number) {
    this.router.navigate(['/meeting/edit/' + id]);
  }

  onDeleteMeeting(id: number) {
    if (confirm('Sind Sie sicher, dass Sie diese Veranstaltung löschen möchten?')){
      this.meetingService.deleteMeeting(id)
      .subscribe(() => {
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
    if (this.isAdmin) {
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
