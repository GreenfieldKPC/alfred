import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  constructor(private http: HttpClient) { }

  getComplaints() {
    return this.http.get<any>('/complaints').toPromise();
  }
}
