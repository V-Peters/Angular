import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import {AppComponent} from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private appComponent: AppComponent) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.tokenStorageService.getAuth()) {
      if (this.tokenStorageService.isAdmin() || state.url === '/meeting/list' || state.url === '/profile' || state.url === '/profile/editUser' || state.url === '/profile/editPassword') {
        return true;
      } else {
        this.appComponent.showSnackbar('Unberechtigter Zugriff.');
        return this.router.createUrlTree(['/access-denied']);
      }
    } else {
      this.appComponent.showSnackbar('Bitte loggen Sie sich zuerst ein.');
      return this.router.createUrlTree(['/login']);
    }
  }
}
