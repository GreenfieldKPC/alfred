
import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintsService } from '../complaints.service';
import { ProfileService } from '../profile.service';
import { MessageService } from '../message.service';


interface Message {
  userid: number;
  message: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  issues: any;
  public logo = "assets/images/logo.png";
  chats: Message;
  message: string;
  sending: boolean;

  constructor(
    private router: Router,
    private complaintService: ComplaintsService,
    config: NgbModalConfig,
    private _profileService: ProfileService,
    private modalService: NgbModal,
    private _messageService: MessageService,
    ) {
      config.backdrop = 'static';
      config.keyboard = false;
      this.issues = [];
     }

  ngOnInit() {
    this.complaintService.getComplaints().then((complaints) => {
      console.log(complaints);
      this.issues = complaints;
    });

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

  getUserInfo(id) {
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

}
