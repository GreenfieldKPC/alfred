import { Component, OnInit } from '@angular/core';
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
  constructor(
      private http: HttpClient,
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
        this.messagesFrom = this.messages[1];
        this.messagesTo = this.messages[0];
        // this.messages[2].forEach((obj) => {
        //   this.messagesFrom.forEach((ob) => {
        //     if (obj.id === ob.id_from){
        //       if(!this.users.hasOwnProperty(obj.username)) {
        //         this.users.push(obj);

        //       } else {
        //         return;
        //       }
        //     }

          // })
        // });
        this.users = this.messages[2];
        console.log(this.messages, 'data');
        console.log(this.users, 'data');
        console.log(this.messagesFrom, 'from');
        console.log(this.messagesTo, 'to');
      });
  }
  onClick(index) {
    console.log(index);
    this.active = index;
    this.read(this.users[index]);
  }
  sendMessage(id) {
    console.log(id);
    this.chats = {
      userid: id,
      message: this.message,
    }
    this.sending = true;
    console.log(this.chats);
    this.http.post('/message', this.chats).subscribe((data) => {
      console.log(data);
    })
    this.message = '';
  }
  filterMess(name) {
    this.messagesFrom.forEach((obj) => {
      if (name === obj.id_from_username) {
        this.box.push(obj);
      }

    });
    this.messagesTo.forEach((obj) => {
      if (name === obj.id_to_username) {
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
    console.log(this.box);
    this.isRead = !this.isRead;
    if (this.isRead === false){
      this.box = [];
    }
    
  }
  // selectedUser(name) {
  //   this.string = name;
  // }
  ngOnInit() {
    this.getMess();
  }

}
