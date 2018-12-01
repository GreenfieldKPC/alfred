import { Component, OnInit, Input } from '@angular/core';
import { JobService } from '../job.service'
// import { toArray } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  categoryLists = ['House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;
  hold:any;
  info:any;
  public takenCount: Number;
  public postedCount: Number;

  constructor(
    private _jobService: JobService,
    private dashboardService: DashboardService
    ) {
    this.takenCount = 0;
    this.postedCount = 0;
  }
  userInfo() {
    this.dashboardService.getUser()
      .subscribe((data) => {
        this.info = data;
        console.log(this.info);
      })
  }
  ngOnInit() {

    this.userInfo();
    this._jobService.getUserJobsTaken().then(data => {
      console.log(data)
      this.hold = data;
      this.takenCount = this.hold.length;
    });
    this._jobService.getUserJobsPosted().then(data => {
      console.log(data)
      this.hold = data;
      this.postedCount = this.hold.length;
    });
  }

}
