import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddService {

  constructor(private http: HttpClient) {  }

  addPost(chore){
    return this.http.post<object>('/add', chore).toPromise();
  }

  chargeUser(payment) {
    return this.http.post("/stripe/charge", { payment }).toPromise();
  }

  payUser(payment) {
    return this.http.post("/stripe/pay", { payment }).toPromise();
  }
}
