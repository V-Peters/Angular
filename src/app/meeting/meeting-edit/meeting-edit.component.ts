import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MeetingService } from '../meeting.service';
import { Meeting } from '../meeting.model';
import { ErrorService } from '../../error/error-service';
import { AppComponent } from '../../app.component';
import { ValidatorsModule } from '../../validation/validators.module';
import { ValidationErrorMessagesModule } from '../../validation/validation-error-messages.module';

@Component({
  selector: 'app-meeting-edit',
  templateUrl: './meeting-edit.component.html',
  styleUrls: ['./meeting-edit.component.css']
})
export class MeetingEditComponent implements OnInit {
  meetingForm: FormGroup;
  id: number;
  today: string;
  now: string;
  meetingExists: boolean;
  isLoading: boolean;
  nameError: string;
  nameAlreadyExists: boolean;
  descriptionError: string;
  textareaLines: number;

  private meeting: Meeting;

  constructor(private router: Router, private route: ActivatedRoute, private meetingService: MeetingService, private errorService: ErrorService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.isLoading = true;
    ValidationErrorMessagesModule.meetingNameError.subscribe(errorMessage => {
      this.nameError = errorMessage;
      this.nameAlreadyExists = this.nameError === 'Es existiert bereits eine Veranstaltung mit diesem Namen.';
    });
    this.today = new DatePipe('de-DE').transform(Date.now(), 'yyyy-MM-dd');
    this.now = new DatePipe('de-DE').transform(Date.now(), 'HH:mm');
    this.meeting = new Meeting(0, '', '', true, 0, '', null);
    this.meetingExists = true;
    this.textareaLines = 5;
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
    this.initForm(0, '', this.today, this.now, '', true);
    if (this.id) {
      this.meetingService.getMeeting(this.id)
      .subscribe(tempMeeting => {
        if (tempMeeting) {
          this.meetingExists = true;
          this.meeting = tempMeeting;
          this.calcTextareaSize();
          this.initForm(this.meeting.id, this.meeting.name, this.meeting.datetime.substr(0, 10), this.meeting.datetime.substr(11, 5), this.meeting.description, this.meeting.display);
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

  private initForm(id: number, name: string, date: string, time: string, description, display: boolean): void {
    this.meetingForm = new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name, ValidatorsModule.meetingNameValidators),
      date: new FormControl(date, ValidatorsModule.meetingDateTimeValidators),
      time: new FormControl(time, ValidatorsModule.meetingDateTimeValidators),
      description: new FormControl(description, ValidatorsModule.meetingDescriptionValidators),
      display: new FormControl(display)
    });
  }

  private castMeetingFormToMeeting(): void {
    this.meeting.id = this.meetingForm.value.id;
    this.meeting.name = this.meetingForm.value.name;
    this.meeting.datetime = this.concatDateAndTime(this.meetingForm.value.date, this.meetingForm.value.time);
    this.meeting.description = this.meetingForm.value.description;
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

  changedName(): void {
    ValidationErrorMessagesModule.changedMeetingName(this.meetingForm, this.meetingService, this.errorService, this.meeting.name);
  }

  changedDescription(): void {
    this.descriptionError = ValidationErrorMessagesModule.changedMeetingDescription(this.meetingForm);
  }

  private calcTextareaSize(): void {
    this.textareaLines = this.meeting.description.split(/\r\n|\r|\n/).length;
    if (this.textareaLines < 5) {
      this.textareaLines = 5;
    }
    if (this.textareaLines > 20) {
      this.textareaLines = 20;
    }
  }
  }
