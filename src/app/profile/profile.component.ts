import { Component, OnInit, Input } from '@angular/core';
import { NgbModalConfig, NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../job.service'
import { PhotoService } from '../photo.service'
import { ProfileService } from '../profile.service'
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
  image: any;
  imageFile: any;
  imageUrl: any;
  public takenCount: Number;
  public postedCount: Number;
  public rating: number;
  public defaultPhoto = "assets/images/non.png";
  public userPhoto: any;

  constructor(
    config: NgbRatingConfig,
    private _jobService: JobService,
    private dashboardService: DashboardService,
    private _photoService: PhotoService,
    private _profileService: ProfileService,
    ) {
    config.max = 5;
    config.readonly = true;
    this.userPhoto = this.defaultPhoto;
    this.takenCount = 0;
    this.postedCount = 0;
    this.image;
    this.rating = 5;
  }
  userInfo() {
    this.dashboardService.getUser()
      .subscribe((data) => {
        this.info = data;
        if (this.info.picture !== undefined && this.info.picture !== 'undefined') {
          this.userPhoto = this.info.picture;
        }
      })
  }
  ngOnInit() {

    this.userInfo();
    this._jobService.getUserJobsTaken().then(data => {
      this.hold = data;
      this.takenCount = this.hold.length;
    });
    this._jobService.getUserJobsPosted().then(data => {
      this.hold = data;
      this.postedCount = this.hold.length;
    });
  }

  processFile() {
    var files = (<HTMLInputElement>document.getElementById('photo')).files
    this.imageFile = files[0]
    var reader = new FileReader();

    reader.addEventListener("load", () => {
      this.image = reader.result;
    }, false);

    if (this.imageFile) {
      reader.readAsDataURL(this.imageFile);
    }

  }

  updatePhoto(image) {

    this._photoService.uploadPhoto(image).then((image) => {
      return this._profileService.updateUserPhoto(image.url)
    }).then((imageUrl) => {
      this.userPhoto = imageUrl;
      console.log(this.userPhoto, 'user photo updated');
    }).catch(err => {
      alert('Something went wrong with upload');
      console.log(err);
    })
  }

}
