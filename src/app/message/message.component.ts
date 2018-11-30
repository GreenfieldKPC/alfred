import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../message.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  messages:any;
  messagesTo:any;
  messagesFrom:any;
  constructor(
      config: NgbModalConfig, 
      private modalService: NgbModal,
      private messageService: MessageService,
    ) {
      config.backdrop = 'static';
      config.keyboard = false;
  }
  open(content) {
    this.modalService.open(content);
  }
  getMess() {
    this.messageService.getAllMessage()
      .subscribe((data) => {
        this.messages = data;
        this.messagesFrom = this.messages[0];
        this.messagesTo = this.messages[1];
        console.log(this.messagesTo);
      });
  }
  ngOnInit() {
    this.getMess();
  }

}
