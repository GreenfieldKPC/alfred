import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'
import { MessageService } from '../message.service';
import { PhotoService } from '../photo.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  public logo = "assets/images/logo.png";
  chats: Message;
  message: string;
  sending: boolean;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _jobService: JobService,
    private _messageService: MessageService,
    private _photoService: PhotoService,
    private _profileService: ProfileService,
    ) {
    this.jobsTaken = [];
    this.jobsPosted = [];
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
    console.log(this.chats);
    this._messageService.sendMessage(this.chats).then((data) => {
      console.log(data);
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
  getJobPoster(job) {
    this._profileService.getUserProfile(job.poster).then((data) => {
      console.log(data);
      // display user thumbnail, rating, username in job description
    });
  }

  

}
