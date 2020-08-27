import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  // get usernames from backend later and bind them to this array
  existingUsernames = ['Chris', 'Anna'];

  constructor() { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, this.forbiddenUsernames.bind(this)]),
      'password': new FormControl(null, Validators.required),
      'firstname': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'company': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    console.log(this.registerForm);
  }

  forbiddenUsernames(control: FormControl): {[s: string]: boolean} {
    if (this.existingUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    } else {
      return null;
    }
  }

}
