import { NgModule, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup} from '@angular/forms';
import {AuthService} from '../authentification/auth.service';
import {ErrorService} from '../error/error-service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ValidationErrorMessagesModule {

  static usernameError = new EventEmitter<string>();
  static emailError = new EventEmitter<string>();

  static changedUsername(form: FormGroup, authService: AuthService, errorService: ErrorService): void {
    const errors = form.controls.username.errors;
    this.usernameError.emit(this.changed(errors).replace('{}', 'en Benutzernamen'));
    if (form.controls.username.valid) {
      authService.checkIfUsernameExists(form.value.username)
        .subscribe(data => {
          if (data === true) {
            this.usernameError.emit('Dieser Benutzername ist bereits vergeben.');
          }
        }, err => {
          errorService.print(err);
        });
    }
  }

  static changedCurrentPassword(form: FormGroup): string {
    const errors = form.controls.currentPassword.errors;
    return this.password(errors);
  }

  static changedPassword(form: FormGroup): string {
    const errors = form.controls.password.errors;
    return this.password(errors);
  }

  static password(errors: any): string {
    return ValidationErrorMessagesModule.changed(errors).replace('{}', ' Passwort');
  }

  static changedPasswordCheck(form: FormGroup): string {
    return (form.value.password !== form.value.passwordCheck) ? 'Die beiden Passwörter stimmen nicht überein' : '';
  }

  static changedFirstname(form: FormGroup): string {
    const errors = form.controls.firstname.errors;
    return ValidationErrorMessagesModule.changed(errors).replace('{}', 'en Vornamen');
  }

  static changedLastname(form: FormGroup): string {
    const errors = form.controls.lastname.errors;
    return ValidationErrorMessagesModule.changed(errors).replace('{}', 'en Nachnamen');
  }

  static changedEmail(form: FormGroup, authService: AuthService, errorService: ErrorService, currentEmail: string): any {
    const errors = form.controls.email.errors;
    this.emailError.emit(this.changed(errors).replace('{}', 'e gültige E-Mail '));
    if (form.value.email !== currentEmail && form.controls.email.valid) {
      authService.checkIfEmailExists(form.value.email)
      .subscribe(emailAlreadyExists => {
        if (emailAlreadyExists) {
          this.emailError.emit('Diese E-Mail ist bereits vergeben.');
        }
      }, err => {
        errorService.print(err);
      });
    }
  }

  static changedCompany(form: FormGroup): string {
    const errors = form.controls.company.errors;
    return ValidationErrorMessagesModule.changed(errors).replace('{}', 'e Firma');
  }

  static changed(errors: any): any {
    if (errors) {
      if (errors.required || errors.email) {
        return 'Bitte geben Sie Ihr{} ein.';
      } else if (errors.minlength) {
        return 'muss mindestens ' + errors.minlength.requiredLength + ' Zeichen lang sein. (' + errors.minlength.actualLength + '/' + errors.minlength.requiredLength + ')';
      } else if (errors.maxlength) {
        return 'darf maximal ' + errors.maxlength.requiredLength + ' Zeichen lang sein. (' + errors.maxlength.actualLength + '/' + errors.maxlength.requiredLength + ')';
      }
    }
    return '';
  }
}
