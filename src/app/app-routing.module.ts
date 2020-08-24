import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingListComponent } from './meeting-list/meeting-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/meeting/list', pathMatch: 'full' },
  { path: 'meeting/list', component: MeetingListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
