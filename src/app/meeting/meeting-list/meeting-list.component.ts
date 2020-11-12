import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Meeting } from '../meeting.model';
import { MeetingService } from '../meeting.service';
import { TokenStorageService } from '../../authentification/token-storage.service';
import { ErrorService } from '../../error/error-service';

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

  constructor(private router: Router, private meetingService: MeetingService, private tokenStorageService: TokenStorageService, private errorService: ErrorService) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getUser()) {
      this.isLoading = true;
      if (this.tokenStorageService.getUser().roles[0] === 'ROLE_ADMIN') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }

      this.meetingService.getMeetings()
      .subscribe((tempMeetings: Meeting[]) => {
        if (tempMeetings.length === 0) {
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
      }, err => {
        this.errorService.print(err);
      });
    }
  }

  initAdmin(): void {
    this.meetings.forEach(meeting => {
      this.initialDisplayValues[meeting.id] = meeting.display;
    });
  }

  initUser(): void {
    this.meetingService.getMeetingsSignedUpToForUser(this.tokenStorageService.getUser().id)
    .subscribe(tempMeetingUsers => {
      this.meetings.forEach(tempMeeting => {
        this.signupValues[tempMeeting.id] = false;
        tempMeetingUsers.forEach(tempMeetinUser => {
          if (tempMeeting.id === tempMeetinUser.idMeeting) {
            this.signupValues[tempMeeting.id] = true;
          }
        });
      });
      this.meetings.forEach(meeting => {
        this.initialSignupValues[meeting.id] = this.signupValues[meeting.id];
      });
    }, err => {
      this.errorService.print(err);
    });
  }

  onAddMeeting(): void {
    this.router.navigate(['/meeting/add']);
  }

  onEditMeeting(id: number): void {
    this.router.navigate(['/meeting/edit/' + id]);
  }

  onDeleteMeeting(id: number): void {
    if (confirm('Sind Sie sicher, dass Sie diese Veranstaltung löschen möchten?')){
      this.meetingService.deleteMeeting(id)
      .subscribe(() => {
        this.ngOnInit();
      }, err => {
        this.errorService.print(err);
      });
    }
  }

  onChangeDisplay(i: number): void {
    this.meetings[i].display = !this.meetings[i].display;
    this.checkForUpdates();
  }

  onChangeSignup(i: number): void {
    this.signupValues[i] = !this.signupValues[i];
    this.checkForUpdates();
  }

  checkForUpdates(): void {
    for (const meeting of this.meetings) {
      this.isDifferent = false;
      if (meeting.display !== this.initialDisplayValues[meeting.id] || this.signupValues[meeting.id] !== this.initialSignupValues[meeting.id]) {
        this.isDifferent = true;
        break;
      }
    }
  }

  onSaveChanges(): void {
    if (this.isAdmin) {
      const changedDisplay = {};
      for (const meeting of this.meetings) {
        if (meeting.display !== this.initialDisplayValues[meeting.id]) {
          changedDisplay[meeting.id] = meeting.display;
        }
      }
      this.meetingService.updateDisplay(changedDisplay)
      .subscribe(() => {
        this.ngOnInit();
      }, err => {
        this.errorService.print(err);
      });
    } else {
      this.meetingService.updateSignup(this.signupValues, this.tokenStorageService.getUser().id)
      .subscribe(() => {
        this.ngOnInit();
      }, err => {
        this.errorService.print(err);
      });
    }
  }

  onShowParticipants(id: number): void {
    this.router.navigate(['/participants/list/' + id]);
  }

}
