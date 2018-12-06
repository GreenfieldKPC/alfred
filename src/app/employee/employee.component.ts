
import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintsService } from '../complaints.service';
import { ProfileService } from '../profile.service';
import { MessageService } from '../message.service';
import { JobService } from '../job.service';


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
  complaintUsername: string;
  jobPhoto: any;

  constructor(
    private router: Router,
    private _complaintService: ComplaintsService,
    config: NgbModalConfig,
    private _profileService: ProfileService,
    private _jobService: JobService,
    private modalService: NgbModal,
    private _messageService: MessageService,
    ) {
      config.backdrop = 'static';
      config.keyboard = false;
      this.issues = [];
      this.complaintUsername ='';
      this.jobPhoto = '';
     }

  ngOnInit() {
    this._complaintService.getComplaints().then((complaints) => {
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

  getUserInfo(complaint) {

    this._profileService.getUserName(complaint.id_user).then((username) => {

      this.complaintUsername = username.username;
      return this._jobService.getJobPhoto(complaint.id_job);
    }).then((photo) => {
      if (photo.url) {
        this.jobPhoto = photo.url;
      } else {
        this.jobPhoto = "assets/images/non.png";
      }  
    }).catch((err) => {
      console.log(err);
    });
  }

  resolveIssue(issue) {
    this._complaintService.resolveComplaint(issue.id).then((data) => {
      console.log(data, 'resolve complaint 85');
    }).catch(err => {
      console.log(err);
    });
  }

}
