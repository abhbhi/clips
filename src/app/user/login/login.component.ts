import { Component, OnInit } from '@angular/core';
import { AngularFireAuth  } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private auth:AngularFireAuth) { }

  ngOnInit(): void {
  }

  credentials={
    email:'',
    password:''
  }
  showAlert=false
  alertMsg='Please wait! Logging in...'
  alertColor='blue'
  inSubmission=false
  async login(){
    this.alertColor='blue'
    this.alertMsg='Please wait! Logging in...'
    this.showAlert=true
    this.inSubmission=true
    try{
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,this.credentials.password
      )
    }catch(e){
      this.inSubmission=false
      this.alertMsg='An unexpected alert occured. Please try again'
      this.alertColor='red'
      return
    }
    this.alertMsg='Success, You\'re now logged in'
    this.alertColor='green'
  }
  

}
