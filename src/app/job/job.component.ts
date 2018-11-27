import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  public jobsTaken;
  public jobsPosted;

  constructor(private _jobService: JobService) {
    this.jobsTaken = [];
    this.jobsPosted = [];
   }

  ngOnInit() {
    this._jobService.getUserJobsTaken().then(data => { this.jobsTaken = data; console.log(this.jobsTaken, 'job line 20')});
    this._jobService.getUserJobsPosted().then(data => { this.jobsPosted = data; console.log(this.jobsTaken, 'job line21')});
  }

}
