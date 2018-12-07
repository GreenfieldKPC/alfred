import { Component, OnInit, ElementRef } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../message.service';
import { HttpClient } from '@angular/common/http';
interface Message {
  userid: number;
  message: string;
}
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  active:number;
  string: string;
  chats: Message;
  message: string;
  sending: boolean;
  messages:any;
  messagesTo:any;
  messagesFrom:any;
  users:any = [];
  isRead:boolean = false;
  box:any = [];
  clickedUser: any;
  constructor(
      private http: HttpClient,
      config: NgbModalConfig, 
      private modalService: NgbModal,
      private messageService: MessageService,
    ) {
      config.backdrop = 'static';
      config.keyboard = false;
  }
  getMess() {
    this.messageService.getAllMessage()
      .subscribe((data) => {
        this.messages = data;
        this.messagesFrom = this.messages[1];
        this.messagesTo = this.messages[0];
        this.users = this.messages[2];
      });
  }
  onClick(user) {
    // this.active = index;
    this.box = [];
    // this.read(this.users[index]);
    this.clickedUser = user;
    this.filterMess(user.username);
    console.log(user);
    
  }
  sendMessage() {
    this.box.push(this.message);
    this.chats = {
      userid: this.clickedUser.id,
      message: this.message,
    }
    this.sending = true;
    if (this.clickedUser.id){
      this.http.post('/message', this.chats).subscribe((data) => {
      })

    }
    this.message = '';
  }
  filterMess(name) {
    this.messagesFrom.forEach((obj) => {
      if (name === obj.id_from_username) {
        obj.text = `<div class="outgoing_msg">
              <div class="sent_msg">
                <p>${obj.text}</p>
            </div>
            </div>`;
        this.box.push(obj);
      }

    });
    this.messagesTo.forEach((obj) => {
      if (name === obj.id_to_username) {
        obj.text = `<div class="incoming_msg">
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>${obj.text}</p>
                </div>
              </div>
            </div>`;
        this.box.push(obj);
      }
    });
    this.box.sort((a, b) => {
      return a.created - b.created;
    })
    
    // this.box.read = this.isRead;
  }
  read(ev) {
    this.filterMess(ev.username);
    // this.selectedUser(ev.username);
    this.isRead = !this.isRead;
    if (this.isRead === false){
      this.box = [];
    }
    
  }
  
  ngOnInit() {
    this.getMess();
  }

}
