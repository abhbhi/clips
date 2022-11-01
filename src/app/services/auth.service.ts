import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map, delay, filter, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';
import IUser from '../models/user.model';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedDelay$: Observable<boolean>
  private redirect = false

  constructor(private auth: AngularFireAuth,
              private db: AngularFirestore,
              private router: Router,
              private route: ActivatedRoute) {
    this.usersCollection = db.collection('users')
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )
    this.isAuthenticatedDelay$ = this.isAuthenticated$.pipe(
      delay(1200)
    )
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false
    })
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password is required')
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    )
    if (!userCred.user) {
      throw new Error("User can't be found")
    }
    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })
    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }
  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault()
    }
    await this.auth.signOut()
    if (this.redirect) {
      await this.router.navigateByUrl('/')
    }
  }
}
