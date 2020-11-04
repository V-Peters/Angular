import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MeetingListComponent } from './meeting/meeting-list/meeting-list.component';
import { MeetingEditComponent } from './meeting/meeting-edit/meeting-edit.component';
import { ParticipantsListComponent } from './user/participants-list/participants-list.component';
import { RegisterComponent } from './authentification/register/register.component';
import { LoginComponent } from './authentification/login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { ErrorService } from './error/error-service';
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'meeting/list', component: MeetingListComponent, canActivate: [ErrorService] },
  { path: 'meeting/add', component: MeetingEditComponent, canActivate: [ErrorService] },
  { path: 'meeting/edit/:id', component: MeetingEditComponent, canActivate: [ErrorService] },
  { path: 'participants/list/:id', component: ParticipantsListComponent, canActivate: [ErrorService] },
  { path: 'profile', component: ProfileComponent, canActivate: [ErrorService] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', component:PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
