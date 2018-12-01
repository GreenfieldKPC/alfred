import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(id) {
    return this.http.get<any>(`/user/profile/${id}`).toPromise();
  }

  getUserRating(id) {
    return this.http.get<any>(`/user/rating/${id}`).toPromise();
  }

  getUserName(id) {
    return this.http.get<any>(`/user/username/${id}`).toPromise();
  }

  getUserPhoto(id) {
    return this.http.get<any>(`/user/photo/${id}`).toPromise();
  }
}
