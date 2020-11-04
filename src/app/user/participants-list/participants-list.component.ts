import { Component, OnInit } from '@angular/core';
import { MeetingService } from 'src/app/meeting/meeting.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.css']
})
export class ParticipantsListComponent implements OnInit {
  id: number;
  users: any;
  isEmpty: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.isEmpty = false;
    this.id = +this.route.snapshot.paramMap.get('id');
    this.meetingService.listParticipants(this.id)
    .subscribe(tempUsers => {
      this.users = tempUsers;
      if (!this.users[0]) {
        this.isEmpty = true;
      }
    });
  }

  onBack() {
    this.router.navigate(['/meeting/list']);
  }

}
