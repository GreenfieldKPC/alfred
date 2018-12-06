import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, observable } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { NgbModalConfig, NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../profile.service';

declare var google: any;


interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;

}
interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}
interface Message {
  userid: number;
  message: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']

})


export class DashboardComponent implements OnInit {
  chats: Message;
  message: string;
  sending: boolean;
  currentRate: number = 7;
  lat: number;
  lng: number;
  categoryLists = ['All', 'House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;
  geocoder: any;
  public location: Location = {
    lat: 30.433283,
    lng: -87.240372,
    marker: {
      lat: 29.9505,
      lng: -90.0753,
      draggable: true
    },

    zoom: 12
  };
  user: any;
  jobs: any;
  searchedObj: object;
  obj = {
    lat: 12,
    lng: 12,
  }
  searchJob: any;
  searchUser: any;
  selectedChore: any;
  selectedChorePosterUsername: any;
  selectedChorePosterRating: any;
  selectedChorePosterPhoto: any;
  test: any;
  test2: string = '2539 Columbus Street, New Orleans, LA';
  infoWindow = new google.maps.InfoWindow();
  public defaultPhoto = "assets/images/non.png";
  @ViewChild(AgmMap) map: AgmMap;
  constructor(
    config: NgbModalConfig,
    rateConfig: NgbRatingConfig,
    private modalService: NgbModal,
    private dashboardService: DashboardService,
    public mapsApiLoader: MapsAPILoader, private router: Router, private http: HttpClient,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper,
    private _profileService: ProfileService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    rateConfig.max = 5;
    rateConfig.readonly = true;
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.selectedChore;
    this.selectedChorePosterUsername;
    this.selectedChorePosterRating;
    this.selectedChorePosterPhoto;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }
  open(content) {
    this.modalService.open(content);
  }
  sendMessage(id) {

    this.chats = {
      userid: id,
      message: this.message,
    }
    this.sending = true;
    this.http.post('/message', this.chats).subscribe((data) => {
    })
    this.message = '';
  }
  addInfoWindow(marker, content, markerIndex) {
    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.setContent(content);
      this.infoWindow.open(this, marker);
    });
  }
  getlatlng(address: string) {

    let geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          observer.next(results[0].geometry.location);
          observer.complete();
        } else {
          console.log('Error - ', results, ' & Status - ', status);
          observer.next({});
          observer.complete();
        }
      });
      this.map.triggerResize();
    })
  }
  updateOnMap() {
    this.findLocation(this.location.address_state);
  }

  takeChore(job) {
    this.dashboardService.takeChore(job).subscribe((data) => {
      alert("Added to My Chores!");
    })
  }

  findLocation(address) {
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < results[0].address_components.length; i++) {
          let types = results[0].address_components[i].types
          if (types.indexOf('country') != -1) {
            this.location.address_country = results[0].address_components[i].long_name
          }
          if (types.indexOf('postal_code') != -1) {
            this.location.address_zip = results[0].address_components[i].long_name
          }
          if (types.indexOf('administrative_area_level_1') != -1) {
            this.location.address_state = results[0].address_components[0].long_name
          }
        }

        if (results[0].geometry.location) {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
        }

        this.map.triggerResize()

      } else {
        alert("Sorry, this search produced no results.");
      }
    })

  }
  logOut() {
    this.http.get("/logOut").subscribe((data) => {
      this.router.navigateByUrl('/');
    })


  }
  testing($event) {

  }
  getList() {
    var category;
    var area;
    if (this.selectedCategory === 'All' || this.selectedCategory === undefined) {
      this.dashboardService.searchArea(this.location.address_state)
        .subscribe((areaObj) => {
          area = areaObj[0].id;
          this.dashboardService.searchJob(area, 'all')
            .subscribe((data) => {
              this.searchJob = data;
              this.searchUser = this.searchJob.users;
              this.searchJob = this.searchJob.jobs;
              this.selectChore(this.searchJob[0]);
            })
        })
    } else {
      this.dashboardService.searchCat(this.selectedCategory)
        .then((catObj) => {
          category = catObj[0].id;
          this.dashboardService.searchArea(this.location.address_state)
            .subscribe((areaObj) => {
              area = areaObj[0].id;
              this.dashboardService.searchJob(area, category)
                .subscribe((data) => {
                  this.searchJob = data;
                  this.searchUser = this.searchJob.users;
                  this.searchJob = this.searchJob.jobs;
                })
            })
        })
    }
    this.updateOnMap();

  }
  getuser() {
    this.dashboardService.getUser()
      .subscribe((user) => {
        this.user = user;
        this.getlatlng(this.user.area).subscribe(result => {
          this.zone.run(() => {
            this.lat = result.lat();
            this.lng = result.lng();
          });
        }, error => console.log(error),
          () => console.log('complete'))
      });
  }
  getjob() {
    this.dashboardService.getJobs()
      .subscribe((jobs) => {
        this.jobs = jobs;
        if(this.jobs[0]) {
          this.selectChore(this.jobs[0]);
        }
      });
  }
  ngOnInit() {
    this.getuser();
    this.getjob();
  }

  selectChore(chore) {
    // display user photo, rating, username in job description
    this.selectedChore = chore;
    console.log('chore selected!');

    this._profileService.getUserName(chore.poster).then((username) => {
      // display chore poster username on chore

      this.selectedChorePosterUsername = username.username;
      return this._profileService.getUserRating(chore.poster);
    }).then((rating) => {
      // display chore poster rating on chore
      this.selectedChorePosterRating = rating.rating;
      return this._profileService.getUserPhoto(chore.poster);
    }).then((photo) => {
      // display chore poster photo on chore
      if (photo.url !== undefined && photo.url !== 'undefined') {
        this.selectedChorePosterPhoto = photo.url;
      } else {
        this.selectedChorePosterPhoto = this.defaultPhoto;
      }
    }).catch((err) => {
      console.log(err);
    });
  }

}