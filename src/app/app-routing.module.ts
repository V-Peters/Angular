import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MeetingListComponent } from './meeting/meeting-list/meeting-list.component';
import { MeetingEditComponent } from './meeting/meeting-edit/meeting-edit.component';
import { ParticipantsListComponent } from './user/participants-list/participants-list.component';
import { RegisterComponent } from './authentification/register/register.component';
import { LoginComponent } from './authentification/login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'meeting/list', component: MeetingListComponent },
  { path: 'meeting/add', component: MeetingEditComponent },
  { path: 'meeting/edit/:id', component: MeetingEditComponent },
  { path: 'participants/list/:id', component: ParticipantsListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
