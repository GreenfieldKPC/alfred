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
  public logo = "assets/images/logo.png";

  constructor(private _jobService: JobService) {
    //these jobs must lesd to another page or popup modal
    this.jobsTaken = [];
    this.jobsPosted = [];
   }

  ngOnInit() {
    this._jobService.getUserJobsTaken().then(data => { this.jobsTaken = data; });
    this._jobService.getUserJobsPosted().then(data => { this.jobsPosted = data; });
  }

}
