import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../authentification/token-storage.service';
import { User } from 'src/app/authentification/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  user: User;
  role: string;

  constructor(private router: Router, private tokenstorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenstorageService.getUser();
    this.role = this.tokenstorageService.isAdmin() ? 'Administrator' : 'Standardbenutzer';
  }

  onEdit(): void {
    this.router.navigate(['profile/edit']);
  }

  onDelete(): void {
    if (confirm('Sind Sie sicher, dass Sie Ihr Profil löschen möchten?')) {
      console.log('gelöscht');
    }
  }

}
