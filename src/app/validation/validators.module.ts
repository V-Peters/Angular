import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators} from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ValidatorsModule {
  static usernameValidators = [Validators.required, Validators.minLength(4), Validators.maxLength(20)];
  static passwordValidators = [Validators.required, Validators.minLength(5), Validators.maxLength(60)];
  static firstnameValidators = [Validators.required, Validators.maxLength(50)];
  static lastnameValidators = [Validators.required, Validators.maxLength(50)];
  static emailValidators = [Validators.required, Validators.maxLength(100), Validators.email];
  static companyValidators = [Validators.required, Validators.maxLength(100)];
}
