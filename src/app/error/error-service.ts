import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  print(data: any): void {
    console.log('EIN FEHLER IST AUFGETRETEN!');
    console.log(data);
  }

}
