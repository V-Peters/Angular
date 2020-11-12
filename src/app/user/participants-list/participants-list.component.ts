import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MeetingService } from '../../meeting/meeting.service';
import { Meeting } from '../../meeting/meeting.model';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['../../loader.css']
})
export class ParticipantsListComponent implements OnInit {
  isLoading = true;
  id: number;
  users: any;
  meeting: Meeting;
  isEmpty: boolean;
  meetingExsists: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isEmpty = false;
    this.id = +this.route.snapshot.paramMap.get('id');
    this.meetingService.listParticipants(this.id)
    .subscribe(tempUsers => {
      this.meetingService.getMeeting(this.id)
      .subscribe(tempMeeting => {
        if (!tempMeeting) {
          console.log('keinMeeting');
          this.meetingExsists = false;
        } else {
          this.meetingExsists = true;
          this.isLoading = false;
          this.meeting = tempMeeting;
        }
      });
      this.users = tempUsers;
      if (!this.users[0]) {
        this.isEmpty = true;
      }
    });

  }

  onBack(): void {
    this.router.navigate(['/meeting/list']);
  }

}
