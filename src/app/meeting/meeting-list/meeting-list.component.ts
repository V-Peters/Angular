import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { Meeting } from '../meeting.model';
import { MeetingService } from '../meeting.service';
import { TokenStorageService } from '../../authentification/token-storage.service';
import { ErrorService } from '../../error/error-service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html'
})
export class MeetingListComponent implements OnInit {
  isLoading = true;
  isAdmin: boolean;
  meetingsExists: boolean;
  meetings: Meeting[];
  signupValues = {};
  isDifferent = false;

  private initialDisplayValues = {};
  private initialSignupValues = {};

  constructor(private router: Router, private meetingService: MeetingService, private tokenStorageService: TokenStorageService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    if (this.tokenStorageService.isLoggedIn()) {
      this.isLoading = true;
      this.isAdmin = this.tokenStorageService.isAdmin();

      this.meetingService.getMeetings()
      .subscribe((tempMeetings: Meeting[]) => {
        if (tempMeetings.length === 0) {
          this.meetingsExists = false;
        } else {
          this.meetingsExists = true;
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
    this.meetingService.getUser(this.tokenStorageService.getUser().id)
    .subscribe(tempUser => {
      this.setSignupValues(tempUser);
      Object.assign(this.initialSignupValues, this.signupValues);
    }, err => {
      this.errorService.print(err);
    });
  }

  setSignupValues(tempUser): void {
    this.meetings.forEach(tempMeeting => {
      this.signupValues[tempMeeting.id] = false;
      tempUser.meetings.forEach(tempMeetingForUser => {
        if (tempMeeting.id === tempMeetingForUser.id) {
          this.signupValues[tempMeeting.id] = true;
        }
      });
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
      .subscribe(nullMeeting => {
        if (!nullMeeting) {
          this.appComponent.showSnackbar(`Die Veranstaltung mit der ID ${id} wurde gelöscht`);
        } else {
          this.appComponent.showSnackbarError();
        }
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
    this.isDifferent = false;
    for (const meeting of this.meetings) {
      if (meeting.display !== this.initialDisplayValues[meeting.id] || this.signupValues[meeting.id] !== this.initialSignupValues[meeting.id]) {
        this.isDifferent = true;
        return;
      }
    }
  }

  onSaveChanges(): void {
    this.isLoading = true;
    if (this.isAdmin) {
      this.saveDisplay();
    } else {
      this.saveSignup();
    }
  }

  saveDisplay(): void {
    const changedDisplay = {};
    for (const meeting of this.meetings) {
      if (meeting.display !== this.initialDisplayValues[meeting.id]) {
        changedDisplay[meeting.id] = meeting.display;
      }
    }
    this.meetingService.updateDisplay(changedDisplay)
    .subscribe(isSuccessful => {
      if (isSuccessful){
        this.showSnackbarSaved();
      } else {
        this.appComponent.showSnackbarError();
      }
      this.ngOnInit();
    }, err => {
      this.isLoading = false;
      this.errorService.print(err);
    });
  }

  saveSignup(): void {
    this.meetingService.updateSignup(this.signupValues)
    .subscribe(isSuccessful => {
      if (isSuccessful) {
        this.showSnackbarSaved();
      } else {
        this.appComponent.showSnackbarError();
      }
      this.ngOnInit();
    }, err => {
      this.isLoading = false;
      this.errorService.print(err);
    });
  }

  showSnackbarSaved(): void {
    this.appComponent.showSnackbar('Änderungen wurden gespeichert');
  }

  onShowParticipants(id: number): void {
    this.router.navigate(['/participants/list/' + id]);
  }

}
