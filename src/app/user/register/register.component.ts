import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

import IUser from 'src/app/models/user.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private auth:AuthService, private emailTaken:EmailTaken) {

  }
  showAlert = false
  alertMsg = 'Please wait you account is being created'
  alertColor = 'blue'
  inSubmission = false

  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ],[this.emailTaken.validate]),
    age: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(18),
      Validators.max(120)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    ]),
    confirm_password: new FormControl('', [
      Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.min(13),
      Validators.max(13)
    ])
  },[RegisterValidators.match('password','confirm_password')])
  async register() {
    this.showAlert = true
    this.alertMsg = 'Please wait you account is being created'
    this.alertColor = 'blue'
    this.inSubmission = true
    const { email, password, name, age, phoneNumber } = this.registerForm.value
    try {

     await this.auth.createUser(this.registerForm.value as IUser)

    } catch (e) {
      
      this.alertMsg = 'An unexpected erro occured'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }
    this.alertMsg = 'Success! Your account has been created '
    this.alertColor = 'green'
  }


}
