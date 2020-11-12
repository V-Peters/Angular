import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../authentification/token-storage.service';
import { User } from 'src/app/authentification/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  user: User;
  role: string;

  constructor(private tokenstorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenstorageService.getUser();
    this.role = this.user.roles[0] === 'ROLE_ADMIN' ? 'Administrator' : 'Standardbenutzer';
  }

}
