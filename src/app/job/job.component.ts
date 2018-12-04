import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'
import { AddService } from '../add.service'
import { MessageService } from '../message.service';
import { PhotoService } from '../photo.service';
import { NgbModalConfig, NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../profile.service';
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
  private lat: any;
  private lon: any;
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
    private _jobService: JobService,
    private _addService: AddService,
    config: NgbRatingConfig,
    private modalService: NgbModal,
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
  getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords);
      }, (err) => {
        reject(err);
      });
    });
  }
  selectedFile = null;

  onFileSelected(event) {
    this.selectedFile = event.target.files[0].url;
  }
  distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }
  onUpload(chore) {
    this.getPosition().then((coords) => {
      this.lat = coords['latitude'];
      this.lon = coords['longitude'];
      let radius = this.distance(chore.lat, chore.lon, this.lat, this.lon, "M");
      if(radius > 2.5) {
        alert('to far away');
      } else {
        alert('ok');
        this._photoService.uploadPhoto(this.selectedFile)
          .then((data) => {
            console.log(data);
            if (data === true) {
              this._jobService.updateJobCompletion(chore.id)
            } 
        });
      }
    });
    console.log(this.selectedFile);
  }
  ngOnInit() {
    this._jobService.getUserJobsTaken().then(data => { this.jobsTaken = data; });
    this._jobService.getUserJobsPosted().then(data => { this.jobsPosted = data; });
  }

  complete(payment) {
    this._addService.payUser(payment).then((data) => {

    }).catch(err => {
      alert('Something went wrong!');
    });
  }

  completeJob(job) {
    // verify photo upload first
    let payout = job.payment * .85;
    console.log(payout, " job line 80")
    
    this._addService.payUser(payout).then((payment) => {
      console.log(payment);
      if (payment === true) {
        alert('Awesome! Job Completed!');
      } else {
        alert('There was a problem completing this job!');
        // console.log(data);
      }
      
      return this._jobService.updateJobCompletion(job);
    }).then((job) => {
      //notify both users of payment and completion
      if (job === true) {
        alert('Awesome! Job Completed!');
      } else {
        alert('There was a problem completing this job!');
        // console.log(data);
      }
    }).catch((err) => {
      alert('There was a problem completing this chore!');
      console.log(err, 'problem completing this chore');
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

  // uploadPhoto(chore, photo) {
  //   //must open camera of mobile device and upload the picture taken
  //   // must save chore id with photo to recall for later use
  //   this._photoService.uploadPhoto(photo).then((data) => {
  //     console.log(data);
  //   });
  // }

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

  submitRating(chore, user) {
    let to;
    if (user === 'doer') {
      to = chore.poster
    } else if (user === 'poster') {
      to = chore.doer
    }
    this._profileService.rateUser({ 
      to: to, 
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
