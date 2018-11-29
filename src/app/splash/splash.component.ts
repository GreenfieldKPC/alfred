import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
  public logo = "assets/images/logo.png";

  constructor() { }

  ngOnInit() {
  }

}
