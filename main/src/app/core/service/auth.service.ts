import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  this.currentUserSubject = new BehaviorSubject<User>(currentUser);
  this.currentUser = this.currentUserSubject.asObservable();
    // this.currentUserSubject = new BehaviorSubject<User>(
    //   JSON.parse(localStorage.getItem('currentUser') || '{}')
    // );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {

      return this.http
      .post<User>(`${environment.apiUrl}/users/auth`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes

          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log(JSON.stringify(user.token))
          this.currentUserSubject.next(user);
          return user.token;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }






  addActivityLog(userId: number, actionType: string, description: string) {
    const body = { userId, actionType, description };

    console.log(body);
    this.http.post(`${environment.apiUrl}/activitylogs/insert`, body)
      .subscribe(
        response => {
          console.log('Logactivity request successful!', response);
        },
        error => {
          console.error('Failed to send Logactivity request:', error);
        }
      );
  }








}
