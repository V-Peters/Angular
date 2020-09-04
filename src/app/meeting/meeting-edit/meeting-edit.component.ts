import { Component, OnInit, Input } from '@angular/core';

import { Meeting } from '../meeting.model';

@Component({
  selector: 'app-meeting-edit',
  templateUrl: './meeting-edit.component.html',
  styleUrls: ['./meeting-edit.component.css']
})
export class MeetingEditComponent implements OnInit {
  @Input() meeting: Meeting;

  constructor() { }

  ngOnInit(): void {
  }

}
