import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  message:string;
  constructor(
      config: NgbModalConfig, 
      private modalService: NgbModal
    ) {
      config.backdrop = 'static';
      config.keyboard = false;
  }
  open(content) {
    this.modalService.open(content);
  }
  ngOnInit() {
  }

}
