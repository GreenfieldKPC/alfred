import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'
import { MessageService } from '../message.service';
import { PhotoService } from '../photo.service';
import { NgbModalConfig, NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../profile.service'

interface Message {
  userid: number;
  message: string;
}


@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})

export class JobComponent implements OnInit {

  public jobsTaken;
  public jobsPosted;
  public choreRating: number;
  public selected: number;
  public hovered: number;
  public choreUsername: string;
  public chorePhoto: any;
  public logo = "assets/images/logo.png";
  public defaultPhoto = "assets/images/non.png";
  chats: Message;
  message: string;
  sending: boolean;
  isClassHidden: false;

  constructor(
    config: NgbRatingConfig,
    private modalService: NgbModal,
    private _jobService: JobService,
    private _messageService: MessageService,
    private _photoService: PhotoService,
    private _profileService: ProfileService,
    ) {
    config.max = 5;
    config.readonly = true;
    this.jobsTaken = [];
    this.jobsPosted = [];
    this.choreRating = 5;
    this.selected = this.choreRating;
    this.hovered = this.choreRating;
    this.choreUsername = '';
    this.chorePhoto = this.defaultPhoto;
   }

  ngOnInit() {
    this._jobService.getUserJobsTaken().then(data => { this.jobsTaken = data; });
    this._jobService.getUserJobsPosted().then(data => { this.jobsPosted = data; });
  }

  completeJob(job) {
    this._jobService.updateJobCompletion(job).then((data) => {
      if (data === true) {
        alert('Awesome! Job Completed!');
      } else {
        alert('There was a problem completing this job!');
        console.log(data);
      }
    });
  }

  open(content) {
    this.modalService.open(content);
  }

  sendMessage(id) {
    this.chats = {
      userid: id,
      message: this.message,
    }
    this.sending = true;
    this._messageService.sendMessage(this.chats).then((data) => {
      this.message = '';
    });  
  }

  uploadPhoto(chore, photo) {
    //must open camera of mobile device and upload the picture taken
    // must save chore id with photo to recall for later use
    this._photoService.uploadPhoto(photo).then((data) => {
      console.log(data);
    });
  }

  navigate(chore) {
    // upen google maps with directions to chore address
  }
  edit(chore) {
    // patch request to jobs endpoint with update of information
  }

  delete(chore) {
    // delete request to jobs endpoint
  }
  getJobPoster(id) {
     // display user photo, rating, username in job description

    this._profileService.getUserName(id).then((username) => {
      // display chore poster username on chore

      this.choreUsername = username.username;
      return this._profileService.getUserRating(id);
    }).then((rating) => {
      // display chore poster rating on chore
      this.choreRating = rating.rating;
      this.selected = rating.rating;
      return this._profileService.getUserPhoto(id);
    }).then((photo) => {
      // display chore poster photo on chore
      if (photo.url !== undefined && photo.url !== 'undefined') {
        this.chorePhoto = photo.url;
      } else {
        this.chorePhoto = this.defaultPhoto;
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  submitRating(chore) {
    this._profileService.rateUser({ 
      to: chore.poster, 
      rating: this.selected,
      job: chore.id
    }).then(() => {
      alert('Success!');
    }).catch((err) => {
      alert('Error sending rating')
      console.log(err);
    });
  }

}
