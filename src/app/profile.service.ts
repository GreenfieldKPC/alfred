import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  //how to get app url for endpoints
  private _url: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getUserProfile() {
    return this.http.get(this._url + "/profile").toPromise();
  }
}
