import { Component, OnInit } from '@angular/core';
import { MeetingService } from 'src/app/meeting/meeting.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.css']
})
export class ParticipantsListComponent implements OnInit {
  id: number;
  users: any;
  isEmpty: boolean;

  constructor(private route: ActivatedRoute, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.isEmpty = false;
    this.id = +this.route.snapshot.paramMap.get('id');
    console.log('id');
    console.log(this.id);
    this.meetingService.listParticipants(this.id)
    .subscribe(tempUsers => {
      console.log(tempUsers);
      this.users = tempUsers;
      if (!this.users[0]) {
        this.isEmpty = true;
      }
    });
  }

}
