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
    console.log(job)
    return this.http.patch<object>('/dashboard/takeChore', {choreId: job.id})
  }
  searchArea(address): Observable<object>{
    return this.http.post<object>('/areas', {'city': address});
  }
  searchJob(area, category): Observable<object>{
    return this.http.post<object>('/searchJobs', {area: area, category: category});
  }
  searchCat(cat) {
    return this.http.post<object>('/category', { 'category': cat }).toPromise();
  }
}
