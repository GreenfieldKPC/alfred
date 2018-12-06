import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { JSDocCommentStmt } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }
  getUserJobsTaken() {
    return this.http.get('/jobs/taken').toPromise();
  }
  getUserJobsPosted() {
    //maybe need observable instead of promise?
    return this.http.get('/jobs/posted').toPromise();
  }
  updateJobCompletion(chore) {
    return this.http.patch('/jobs/complete', { choreId: chore.id }).toPromise();
  }

  getJobPhoto(id) {
    return this.http.get<any>(`jobs/photos/${id}`).toPromise();
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
