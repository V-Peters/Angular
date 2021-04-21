import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MeetingService } from '../meeting.service';
import { Meeting } from '../meeting.model';
import { ErrorService } from '../../error/error-service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-meeting-edit',
  templateUrl: './meeting-edit.component.html'
})
export class MeetingEditComponent implements OnInit {
  meetingForm: FormGroup;
  id: number;
  today: string;
  now: string;
  meetingExists: boolean;
  isLoading: boolean;

  private meeting: Meeting;

  constructor(private router: Router, private route: ActivatedRoute, private meetingService: MeetingService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.today = new DatePipe('de-DE').transform(Date.now(), 'yyyy-MM-dd');
    this.now = new DatePipe('de-DE').transform(Date.now(), 'HH:mm');
    this.meeting = new Meeting(0, '', '', true, null);
    this.meetingExists = true;
    this.route.params
    .subscribe((params: Params) => {
      if (params.id != null) {
        this.id = +params.id;
      }
      this.init();
    }, err => {
      this.errorService.print(err);
    });
  }

  private init(): void {
    this.initForm(0, '', this.today, this.now, true);
    if (this.id) {
      this.meetingService.getMeeting(this.id)
      .subscribe(tempMeeting => {
        console.log(tempMeeting);
        if (tempMeeting) {
          this.meetingExists = true;
          this.meeting = tempMeeting;
          this.initForm(this.meeting.id, this.meeting.name, this.meeting.datetime.substr(0, 10), this.meeting.datetime.substr(11, 5), this.meeting.display);
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.meetingExists = false;
        }
      }, err => {
        this.errorService.print(err);
      });
    } else {
      this.isLoading = false;
    }
  }

  private initForm(id: number, name: string, date: string, time: string, display: boolean): void {
    this.meetingForm = new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name, [Validators.required, Validators.maxLength(100)]),
      date: new FormControl(date, Validators.required),
      time: new FormControl(time, Validators.required),
      display: new FormControl(display)
    });
  }

  private castMeetingFormToMeeting(): void {
    this.meeting.id = this.meetingForm.value.id;
    this.meeting.name = this.meetingForm.value.name;
    this.meeting.datetime = this.concatDateAndTime(this.meetingForm.value.date, this.meetingForm.value.time);
    this.meeting.display = this.meetingForm.value.display;
  }

  private concatDateAndTime(date: string, time: string): string {
    return date + 'T' + time;
  }

  onSubmit(): void {
    this.castMeetingFormToMeeting();
    this.meetingService.saveMeeting(this.meeting)
    .subscribe(savedMeeting => {
      if (savedMeeting) {
        if (this.meetingForm.value.id === 0) {
          this.appComponent.showSnackbar('Die Veranstaltung wurde erfolgreich gespeichert');
        } else {
          this.appComponent.showSnackbar('Die Veranstaltung wurde erfolgreich bearbeitet');
        }
      } else {
        this.appComponent.showSnackbarError();
      }
      this.router.navigate(['/meeting/list']);
    }, err => {
      this.errorService.print(err);
    });
  }

  onBackToList(): boolean {
    if (this.meetingForm.touched) {
      if (!confirm('Änderungen verwerfen?')) {
        return false;
      }
    }
    this.router.navigate(['/meeting/list']);
  }

}
