import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../authentification/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;

  constructor(private tokenstorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenstorageService.getUser();
  }

}
