import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { TokenStorageService } from '../token-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  // get usernames from backend later and bind them to this array
  existingUsernames = ['Chris', 'Anna'];
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  usernameAlreadyExists = false;
  emailAlreadyExists = false;

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, this.forbiddenUsernames.bind(this)]),
      'password': new FormControl(null, Validators.required),
      'firstname': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'company': new FormControl(null, Validators.required)
    })
  }
  
    forbiddenUsernames(control: FormControl): {[s: string]: boolean} {
      if (this.existingUsernames.indexOf(control.value) !== -1) {
        return {'nameIsForbidden': true};
      } else {
        return null;
      }
    }

  onSubmit(): void {
    this.authService.register(this.registerForm)
    .subscribe(registerData => {
      console.log('data:');
      console.log(registerData);
      this.isSuccessful = true;
      this.isSignUpFailed = false;
      this.authService.login(this.registerForm)
      .subscribe(loginUser => {
        this.tokenStorageService.saveToken(loginUser.accessToken);
        this.tokenStorageService.saveUser(loginUser);
        this.router.navigate(['/profile']);
      }, err => {
        this.errorMessage = err.error.message;
      });
    }, err => {
      this.errorMessage = err.error.message;
      this.isSignUpFailed = true;
      this.usernameAlreadyExists = true;
      this.emailAlreadyExists = true;
    });
  }

}
