import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  public jobsTaken = [];
  public jobsPosted = [];

  constructor(private _jobService: JobService) { }

  ngOnInit() {
    this._jobService.getUserJobsTaken().subscribe(data => this.jobsTaken = data);
    this._jobService.getUserJobsPosted().subscribe(data => this.jobsPosted = data);
  }

}
