
import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, observable } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  issues: any;

  constructor(private router: Router, private http: HttpClient,) { }

  ngOnInit() {
    this.http.get('/complaints').subscribe((data) =>{
      this.issues = data;
      console.log(this.issues)
    })

  }

}
