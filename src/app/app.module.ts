import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertModule } from 'ngx-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { JobService } from './job.service';
import { UploadComponent } from './upload/upload.component';
import { EmployeeComponent } from './employee/employee.component';
import { HelpComponent } from './help/help.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    UploadComponent,
    EmployeeComponent,
    HelpComponent,
    EmployeeLoginComponent,
    EditComponent
  ],
  imports:[
    BrowserModule,
    HttpClientModule,
    CommonModule,
    NgtUniversalModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyDaXjBhM9uS_rV_LlWJIQQsqK2bk_3cto8' }),
    FormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    AlertModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    GoogleMapsAPIWrapper,
    JobService
  ],
})
export class AppModule { }
