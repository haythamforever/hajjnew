import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import * as firebase from 'Firebase';
import { Device } from '@ionic-native/device';

declare var google;
 

@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html'
})
export class DriverPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;
 
  isTracking = false;
  trackedRoute = [];
  previousTracks = [];
  markers = [];
  ref = firebase.database().ref('italytracker/');
  positionSubscription: Subscription;
  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation, private storage: Storage,private device: Device) 
  { 

  }

  ionViewDidLoad() {
    this.plt.ready().then(() => {
      this.loadHistoricRoutes();
 
      let mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
      this.geolocation.getCurrentPosition().then(pos => {
        let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.setCenter(latLng);
        this.map.setZoom(16);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }
 
  loadHistoricRoutes() {
    this.storage.get('routes').then(data => {
      if (data) {
        this.previousTracks = data;
      }
    });

    
  }

  setstartMarker()
  {

    this.geolocation.getCurrentPosition().then(pos => {
      let image = 'assets/imgs/mappin.png';
      let updatelocation = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
  //let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      this.map.setCenter(updatelocation);
      this.map.setZoom(16);
       this.addMarker(updatelocation,image);

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  startTracking() {
    this.isTracking = true;
    this.trackedRoute = [];
    this.setstartMarker();
    this.positionSubscription = this.geolocation.watchPosition()
      .pipe(
        filter((p) => p.coords !== undefined) //Filter Out Errors
      )
      .subscribe(data => {
        setTimeout(() => {
          this.clearMarkers();
          this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
          this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);

          let image = 'assets/imgs/green-bike.png';
          let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);

          this.redrawPath(this.trackedRoute);
        }, 0);
      });
 
  }
 
  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }
 
    if (path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentMapTrack.setMap(this.map);
    }
  }
 
  stopTracking() {
    let newRoute = { finished: new Date().getTime(), path: this.trackedRoute };
    this.previousTracks.push(newRoute);
    this.storage.set('routes', this.previousTracks);
   
    this.isTracking = false;
    this.positionSubscription.unsubscribe();
    this.deleteMarkers();
    if(this.currentMapTrack != null)
    {
    this.currentMapTrack.setMap(null);
    }
  
    if(localStorage.getItem('mykey')!=null)
    {
    firebase.database().ref('italytracker/'+localStorage.getItem('mykey')).remove();
    }
  }
   
  showHistoryRoute(route) {
    console.log(route);
    route.forEach((element,index)=> {
      if(index==0 )
      {
        debugger;
        let image = 'assets/imgs/mappin.png';
        let updatelocation = new google.maps.LatLng(element.lat,element.lng);
        this.map.setCenter(updatelocation);
        this.map.setZoom(16);
       this.addMarker(updatelocation,image);

        console.log(element[0]);

      }
       if( index == route.length-1)
      {
        let image = 'assets/imgs/mappinend.png';
        let updatelocation = new google.maps.LatLng(element.lat,element.lng);
        this.map.setCenter(updatelocation);
        this.map.setZoom(16);
       this.addMarker(updatelocation,image);

      }
    });
    this.redrawPath(route);
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    debugger;
    if(this.markers.length > 1)
    {
  this.markers.splice(1);
    }
   // else{
    this.markers.push(marker);
   // alert(this.markers.length);
   // } 
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  updateGeolocation(uuid, lat, lng) {
    debugger;
    if(localStorage.getItem('mykey')) {
      firebase.database().ref('italytracker/'+localStorage.getItem('mykey')).set({
        uuid: uuid,
        latitude: lat,
        longitude : lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('mykey', newData.key);
    }
  }

}
