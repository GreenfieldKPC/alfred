import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  //how to get app url for endpoints
  private _url: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
  getUserJobsTaken() {
    return this.http.get(this._url + '/jobs/taken').toPromise();
  }
  getUserJobsPosted() {
    //maybe need observable instead of promise?
    return this.http.get(this._url + '/jobs/posted').toPromise();
  }
}
