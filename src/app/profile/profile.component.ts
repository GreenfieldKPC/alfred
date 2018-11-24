import { Component, OnInit, Input } from '@angular/core';
import { JobService } from '../job.service'
// import { toArray } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public takenCount: Number;
  public postedCount: Number;

  constructor(private _jobService: JobService) {
    this.takenCount = 0;
    this.postedCount = 0;
   }

  ngOnInit() {
    this._jobService.getUserJobsTaken().then(data => {
      // how to get length of data object??
      // this.takenCount = data.toArray().length;
    });
    this._jobService.getUserJobsPosted().then(data => {
      // how to get length of data object??
      // this.takenCount = data.length()
    });
  }

}
