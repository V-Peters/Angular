import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MeetingService } from '../../meeting/meeting.service';
import { Meeting } from '../../meeting/meeting.model';
import { User } from 'src/app/authentification/user.model';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['../../loader.css']
})
export class ParticipantsListComponent implements OnInit {
  isLoading = true;
  id: number;
  meeting: Meeting;
  isEmpty: boolean;
  meetingExsists: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isEmpty = false;
    this.id = +this.route.snapshot.paramMap.get('id');

    this.meetingService.getMeeting(this.id)
    .subscribe(tempMeeting => {
      console.log(tempMeeting);
      if (!tempMeeting) {
        this.meetingExsists = false;
      } else {
        this.meetingExsists = true;
        this.isLoading = false;
        this.meeting = tempMeeting;
        if (!this.meeting.users[0]) {
          this.isEmpty = true;
        }
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/meeting/list']);
  }

}
