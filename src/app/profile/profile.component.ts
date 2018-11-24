import { Component, OnInit, Input } from '@angular/core';
import { JobService } from '../job.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public jobsTaken: Object = [];
  public jobsPosted: Object = [];

  constructor(private _jobService: JobService) { }

  ngOnInit() {
    this._jobService.getUserJobsTaken().then(data => {
      console.log(data)
      this.jobsTaken = data
    });
    this._jobService.getUserJobsPosted().then(data => {
      console.log(data)
      this.jobsPosted = data
    });
    console.log(this.jobsPosted, 'posted', this.jobsTaken, 'taken profile page');
  }

}
