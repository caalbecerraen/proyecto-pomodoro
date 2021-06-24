import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Timer } from '../utils/timer.interface';
import { Headers } from './header';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private endpoint = environment.endpoint;
  private httpOptions = {};

  constructor(private http: HttpClient,
    private header: Headers) {}

  getTimerByType(type: number): Observable<any> {
    this.httpOptions = this.header.getHeader();
    return this.http.get(this.endpoint + `timer/${type}`, this.httpOptions);
  }

  create(timer: Timer): Observable<any> {
    this.httpOptions = this.header.getHeader();
    return this.http.post(this.endpoint + 'timer/create', timer, this.httpOptions).pipe(
      tap((timer) => console.log(`Usuario creado`)),
      catchError(this.handleError<any>('Usuario no creado')));
  }

  updateTimer(id: string, timer: Timer): Observable<any> {
    this.httpOptions = this.header.getHeader();
    return this.http.put(this.endpoint + `timer/${id}`, timer, this.httpOptions);
  }

  deleteTimer(id: string): Observable<any> {
    this.httpOptions = this.header.getHeader();
    return this.http.delete(this.endpoint + `timer/${id}`, this.httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for timer consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
