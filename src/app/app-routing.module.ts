import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { HelpComponent } from './help/help.component';
import { EmployeeComponent } from './employee/employee.component';


const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'add', component: AddComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'taken', component: TakenComponent },
  { path: 'posted', component: PostedComponent },
  { path: 'message', component: MessageComponent },
  { path: 'job', component: JobComponent },
  { path: 'help', component: HelpComponent },
  { path: 'employee', component: EmployeeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [SplashComponent, LogInComponent, SignUpComponent, DashboardComponent, NavbarComponent, AddComponent, ProfileComponent, TakenComponent, PostedComponent, MessageComponent, JobComponent, HelpComponent, EmployeeComponent];