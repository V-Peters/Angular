import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './authentification/auth-guard';
import { HomeComponent } from './home/home.component';
import { MeetingListComponent } from './meeting/meeting-list/meeting-list.component';
import { MeetingEditComponent } from './meeting/meeting-edit/meeting-edit.component';
import { ParticipantsListComponent } from './user/participants-list/participants-list.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './authentification/register/register.component';
import { LoginComponent } from './authentification/login/login.component';
import { ForgotPasswordComponent } from './authentification/forgot-password/forgot-password.component';
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { ProfileEditComponent } from './user/profile/profile-edit/profile-edit.component';
import { EmailSentComponent } from './authentification/forgot-password/email-sent/email-sent.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'meeting/list', component: MeetingListComponent, canActivate: [AuthGuard] },
  { path: 'meeting/add', component: MeetingEditComponent, canActivate: [AuthGuard] },
  { path: 'meeting/edit/:id', component: MeetingEditComponent, canActivate: [AuthGuard] },
  { path: 'participants/list/:id', component: ParticipantsListComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'email-sent', component: EmailSentComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
