import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) { }

  uploadPhoto(photo) {
    return this.http.post<any>('/photo', { image: photo }).toPromise();
  }

}
