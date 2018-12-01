import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'
import { MessageService } from '../message.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    ) {
    //these jobs must lesd to another page or popup modal
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

}
