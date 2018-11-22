import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
declare var google: any;

interface Marker {
  [index: number] :{
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
}
interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
  
})


export class DashboardComponent implements OnInit {
  public userChores = [
    {
    marker: {
    lat: 29.951065,
    lng: -90.071533,
    draggable: true
      }
    },
    {
      marker: {
        lat: 29.942662896,
        lng: -90.07583303,
        draggable: true
      }
    },
    {
      marker: {
        lat: 29.9505,
        lng: -90.0753,
        draggable: true
      }
    },
];
  geocoder: any;
  public location: Location = {
    lat: 29.951065,
    lng: -90.071533,
    
    zoom: 14
  };
  @ViewChild(AgmMap) map: AgmMap;
  constructor(public mapsApiLoader: MapsAPILoader, private router: Router, private http: HttpClient,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  logOut() {
    this.http.get("/logOut").subscribe((data) => {
      console.log(data);
        this.router.navigateByUrl('/');
    })


  }

  ngOnInit() {
    
  }

}
