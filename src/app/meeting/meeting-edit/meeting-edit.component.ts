import { Component, OnInit } from '@angular/core';

import { Meeting } from '../meeting.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MeetingService } from '../meeting.service';
import { getLocaleDateTimeFormat, DatePipe } from '@angular/common';

@Component({
  selector: 'app-meeting-edit',
  templateUrl: './meeting-edit.component.html',
  styleUrls: ['./meeting-edit.component.css']
})
export class MeetingEditComponent implements OnInit {
  meetingForm: FormGroup;
  id: number = 0;
  now: string;

  constructor(private router: Router, private route: ActivatedRoute, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.now = new DatePipe('en-US').transform(Date.now(), 'yyyy-MM-ddTHH:mm');
    this.route.params.subscribe(
      (params: Params) => {
        if (params['id'] != null) {
          this.id = +params['id'];
        }
        console.log('id: ' + this.id);
        this.init();
      }
    );
  }

  private init() {

    console.log(getLocaleDateTimeFormat);

    this.initForm(0, '', this.now, true);

    if (this.id) {
      this.meetingService.getMeeting(this.id)
      .subscribe(tempMeeting => {
        this.initForm(tempMeeting.id, tempMeeting.name, tempMeeting.datetime, tempMeeting.display);
      });
    }
  }

  private initForm(id: number, name: string, datetime: string, display: boolean) {
    
    this.meetingForm = new FormGroup({
      'id': new FormControl(id),
      'name': new FormControl(name, Validators.required),
      'datetime': new FormControl(datetime, Validators.required),
      'display': new FormControl(display)
    })
  }

  onSubmit() {
    console.log(this.meetingForm.value);
    
    this.meetingService.saveMeeting(this.meetingForm.value).subscribe();
    this.router.navigate(['/meeting/list']);
  }

  onBackToList() {
    if (this.meetingForm.touched) {
      if (!(confirm('Änderungen verwerfen?'))) return false;
    }
    this.router.navigate(['/meeting/list']);
  }

}
