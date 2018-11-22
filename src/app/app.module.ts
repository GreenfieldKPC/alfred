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


@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports:[
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
    GoogleMapsAPIWrapper
  ],
})
export class AppModule { }
