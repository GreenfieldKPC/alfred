import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  //how to get app url for endpoints
  // private _url: string = '';

  constructor(private http: HttpClient) { }
  // getUserJobsTaken() {
  //   return this.http.get(this._url + '/jobsTaken');
  // }
  // getUserJobsPosted() {
  //   return this.http.get(this._url + '/jobsPosted');
  // }
}
