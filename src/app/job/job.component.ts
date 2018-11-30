import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'
import { AddService } from '../add.service'

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  public jobsTaken;
  public jobsPosted;
  public logo = "assets/images/logo.png";

  constructor(
    private _jobService: JobService,
    private _addService: AddService
    ) {
    this.jobsTaken = [];
    this.jobsPosted = [];
   }

  ngOnInit() {
    this._jobService.getUserJobsTaken().then(data => { this.jobsTaken = data; });
    this._jobService.getUserJobsPosted().then(data => { this.jobsPosted = data; });
  }

  complete(payment) {
    this._addService.payUser(payment).then((data) => {

    }).catch(err => {
      alert('Something went wrong!');
      console.log(err);
    });
  }

}
