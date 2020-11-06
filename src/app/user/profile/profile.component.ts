import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../authentification/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  user: any;
  rolle: string;

  constructor(private tokenstorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenstorageService.getUser();
    this.rolle = this.user.roles[0] == 'ROLE_ADMIN' ? 'Administrator' : 'Standardbenutzer';
  }

}
