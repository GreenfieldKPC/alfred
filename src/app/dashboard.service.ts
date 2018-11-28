import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  getUser(): Observable<object>{
    return this.http.get<object>('/user');
  }
  getJobs(): Observable<[]>{
    return this.http.get<[]>('/jobs');
  }
  takeChore(job): Observable<object>{
    return this.http.patch<object>('/dashboard/takeChore', {choreId: job.id});
  }
}
