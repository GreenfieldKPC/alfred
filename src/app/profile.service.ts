import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(id) {
    return this.http.get(`user/profile/:${id}`).toPromise();
  }

  getUserRating(id) {
    return this.http.get(`user/rating/:${id}`).toPromise();
  }

  getUserName(id) {
    return this.http.get(`user/username/:${id}`).toPromise();
  }

  getUserPhoto(id) {
    return this.http.get(`user/photo/:${id}`).toPromise();
  }
}
