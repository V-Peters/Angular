import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingListComponent } from './meeting/meeting-list/meeting-list.component';
import { MeetingEditComponent } from './meeting/meeting-edit/meeting-edit.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'meeting/list', component: MeetingListComponent },
  { path: 'meeting/add', component: MeetingEditComponent },
  { path: 'meeting/edit/:id', component: MeetingEditComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
