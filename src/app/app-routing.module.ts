import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/meeting/list', pathMatch: 'full' },
  { path: 'meeting/list', component: MeetingListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
