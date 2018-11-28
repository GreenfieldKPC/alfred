import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  getUser(): Observable<object>{
    return this.http.get<object>('/user')
    
  }
  getJobs(): Observable<any>{
    return this.http.get<any>('/jobs')

  }
  takeChore(job): Observable<object>{
    return this.http.patch<object>('/dashboard/takeChore', {choreId: job.id})
  }
}
