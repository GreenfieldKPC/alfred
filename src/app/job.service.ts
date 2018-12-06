import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return this.http.get<any>(`/jobs/photos/${id}`).toPromise();
  }

  getJob(id) {
    return this.http.get<any>(`/jobs/job/${id}`).toPromise();
  }

}
