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
        this.users = this.messages[2];
      });
  }
  onClick(index) {
    this.active = index;
    this.read(this.users[index]);
    
  }
  keep() {
    var x = document.getElementById('messagebox');
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }
  sendMessage(id) {
    this.chats = {
      userid: id,
      message: this.message,
    }
    this.sending = true;
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
