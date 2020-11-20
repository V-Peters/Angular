import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Schließen', {
      duration: 5000
    });
  }

  showSnackbarError(): void {
    this.showSnackbar('Ein unerwarteter Fehler ist aufgetreten.');
  }
}
