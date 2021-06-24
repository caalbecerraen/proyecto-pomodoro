import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Headers {
  headers: HttpHeaders = new HttpHeaders();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor() {}

  setToken(token: string) {
    this.httpOptions.headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.httpOptions;
  }

  getHeader() {
    return this.httpOptions;
  }
}
