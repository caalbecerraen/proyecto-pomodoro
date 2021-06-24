import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers } from './header';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../utils/user.interface';
import { Login } from '../utils/login.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = environment.endpoint;
  private httpOptions = {};

  constructor(private http: HttpClient, private header: Headers) {}

  login(data: Login): Observable<any> {
    this.httpOptions = { 'Content-Type': 'application/json' };
    return this.http.post(this.endpoint + 'login', data, this.httpOptions);
  }

  signUp(user: User): Observable<any> {
    this.httpOptions = { 'Content-Type': 'application/json' };
    return this.http.post(this.endpoint + 'signup', user, this.httpOptions).pipe(
      tap((user) => console.log(`Usuario creado`)),
      catchError(this.handleError<any>('Usuario no creado')));
  }

  validateSession(token: string): Observable<boolean> {
    this.httpOptions = { 'Content-Type': 'application/json' };
    return token ? this.http.post(this.endpoint + 'validate', { token }, this.httpOptions).pipe(
      tap(res => console.log(res)),
      map(
        res => true,
        (error: any) => false
      )
    ) : of(false);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
