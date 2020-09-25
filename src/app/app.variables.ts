import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './authentification/token-storage.service';

@Injectable({
    providedIn:'root'
})
export class AppVariables implements OnInit{

    loggedIn = false;
    loggedIdObs: Observable<boolean>;

    userUsername: string;
    userFirstname: string;
    userLastname: string;
    userStatus: string;
    
    constructor(private tokenStorageService: TokenStorageService) {}

    ngOnInit(): void {
        this.loggedIn = !!this.tokenStorageService.getToken();
        this.loggedIdObs = Observable.create(observer => {
        })
    }
}