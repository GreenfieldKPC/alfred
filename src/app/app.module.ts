import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddComponent } from './add/add.component';
import { ProfileComponent } from './profile/profile.component';
import { TakenComponent } from './taken/taken.component';
import { PostedComponent } from './posted/posted.component';
import { MessageComponent } from './message/message.component';
import { JobComponent } from './job/job.component';
import { AlertModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    LogInComponent,
    SignUpComponent,
    DashboardComponent,
    NavbarComponent,
    AddComponent,
    ProfileComponent,
    TakenComponent,
    PostedComponent,
    MessageComponent,
    JobComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AlertModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
