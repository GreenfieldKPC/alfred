import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient,) { }
  addUser(user): Observable<any>{
    return this.http.post<any>("/signup", user);
  }
  addCategory(category): Observable<any>{
    return this.http.post<any>("/category", {'category': category});
  }
}
