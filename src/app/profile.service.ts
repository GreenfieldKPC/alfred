import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  

  constructor(private http: HttpClient) { 
  }

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

  updateUserPhoto(url) {
    //patch request to user table, update picture url
    return this.http.patch<any>(`/user/photo`, { url }).toPromise();
  }

  updateUserInfo(options) {
    return this.http.patch<any>('/user/update', options).toPromise();
  }

  rateUser(options) {
    return this.http.post('user/rating', options).toPromise();
  }
}
