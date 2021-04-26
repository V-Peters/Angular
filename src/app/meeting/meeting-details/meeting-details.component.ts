import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MeetingService } from '../meeting.service';
import { Meeting } from '../meeting.model';
import { Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { Author } from '../../user/author.model';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class MeetingDetailsComponent implements OnInit {
  @Input() id: number;
  @Output() deactivateDetails = new EventEmitter<void>();
  isLoading = true;
  meeting: Meeting;
  author: Author;
  textareaLines: number;

  constructor(private router: Router, private meetingService: MeetingService, private userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.meetingService.getMeeting(this.id)
    .subscribe((tempMeeting: Meeting) => {
      this.meeting = tempMeeting;
      this.userService.getAuthor(this.meeting.authorId)
      .subscribe((tempAuthor: Author) => {
        this.author = tempAuthor;
        this.isLoading = false;
      });
    });
  }

  onEditMeeting(id: number): void {
    this.router.navigate(['/meeting/edit/' + id]);
  }

  onClose(): void {
    this.deactivateDetails.emit();
  }
}
