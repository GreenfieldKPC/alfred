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
  chats: Message;
  message: string;
  sending: boolean;
  messages:any;
  messagesTo:any;
  messagesFrom:any;
  users:any = [];
  isRead:boolean = false;
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
        
        // if (this.messages[2].id.includes(this.messagesFrom.id_from)){
        //   this.user.push(this.messages[2].username);
        //   console.log(this.user);
        // }
        this.messages[2].forEach((obj) => {
          this.messagesFrom.forEach((ob) => {
            if (obj.id === ob.id_from){
              if(!this.users.includes(obj.username)) {
                this.users.push(obj);

              } else {
                return;
              }
            }

          })
        });
        console.log(this.users, 'data');
        console.log(this.messagesFrom, 'from');
        console.log(this.messagesTo, 'to');
      });
  }
  sendMessage(id) {
    console.log(id);
    // id = Number(id);
    this.chats = {
      userid: id,
      message: this.message,
    }
    this.sending = true;
    console.log(this.chats);
    // this.http.post('/message', this.chats).subscribe((data) => {
    //   console.log(data);
    // })
    this.message = '';
  }
  read() {
    this.isRead = !this.isRead;
  }
  ngOnInit() {
    this.getMess();
  }

}
