import { Component, OnInit, Input } from '@angular/core';
import { JobService } from '../job.service'
// import { toArray } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  categoryLists = ['House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;

  public takenCount: Number;
  public postedCount: Number;

  constructor(private _jobService: JobService) {
    this.takenCount = 0;
    this.postedCount = 0;
   }

  ngOnInit() {


    this._jobService.getUserJobsTaken().then(data => {
     console.log(data)
    });
    this._jobService.getUserJobsPosted().then(data => {
  console.log(data)
    });
  }

}
