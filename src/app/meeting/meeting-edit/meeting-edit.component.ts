import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MeetingService } from '../meeting.service';
import { Meeting } from '../meeting.model';

@Component({
  selector: 'app-meeting-edit',
  templateUrl: './meeting-edit.component.html'
})
export class MeetingEditComponent implements OnInit {
  meetingForm: FormGroup;
  meeting: Meeting;
  id: number;
  now: string;

  constructor(private router: Router, private route: ActivatedRoute, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.now = new DatePipe('en-US').transform(Date.now(), 'yyyy-MM-ddTHH:mm');
    this.route.params.subscribe(
      (params: Params) => {
        if (params.id != null) {
          this.id = +params.id;
        }
        this.init();
      }
    );
  }

  private init(): void {
    this.initForm(0, '', this.now, true);
    if (this.id) {
      // this.meeting = this.meetingService.getMeeting(this.id);
      this.meetingService.getMeeting(this.id)
      .subscribe(tempMeeting => {
        this.meeting = tempMeeting;
        this.initForm(this.meeting.id, this.meeting.name, this.meeting.datetime, this.meeting.display);
      });
    }
  }

  private initForm(id: number, name: string, datetime: string, display: boolean): void {
    this.meetingForm = new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name, [Validators.required, Validators.maxLength(100)]),
      datetime: new FormControl(datetime, Validators.required),
      display: new FormControl(display)
    });
  }

  onSubmit(): void {
    this.meetingService.saveMeeting(this.meetingForm.value)
      .subscribe(() => {
        this.router.navigate(['/meeting/list']);
      });
  }

  onBackToList(): boolean {
    if (this.meetingForm.touched) {
      if (!(confirm('Änderungen verwerfen?'))) {
        return false;
      }
    }
    this.router.navigate(['/meeting/list']);
  }

}
