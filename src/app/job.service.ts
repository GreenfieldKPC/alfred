import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { JSDocCommentStmt } from '@angular/compiler';
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
  updateJobCompletion(chore) {
    return this.http.patch('/jobs/complete', { choreId: chore.id }).toPromise();
  }
  updateJob(chore) {
    return this.http.patch('/jobs/update', { choreId: chore.id }).toPromise();
  }
  deleteJob(chore) {
    return this.http.post('/jobs/delete', { choreId: chore.id }).toPromise();
  }
 
  updateJobId(job, url): Observable<object>{
    return this.http.patch<object>('/jobs/:id', {choreId: job.id, doer: job.doer, photoDoer: url});
  }
}
