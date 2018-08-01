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
  selector: 'page-rider',
  templateUrl: 'rider.html'
})
export class RiderPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;
 
  isTracking = true;
  trackedRoute = [];
  previousTracks = [];
  markers = [];
  ref = firebase.database().ref('italytracker/');
  positionSubscription: Subscription;


   constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation, private storage: Storage,private device: Device) {
    this.ref.on('value', resp => {

      this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
       // this.trackedRoute.push({ lat: data.latitude, lng: data.longitude });
        //this.redrawPath(this.trackedRoute);
      
        if(this.isTracking == true)
        {
        if(data.uuid !== this.device.uuid) {
          let image = 'assets/imgs/green-bike.png';
           let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
        //  console.log("1",updatelocation);
     //   this.map.setCenter(updatelocation);
      //  this.map.setZoom(16);
          this.setMapOnAll(this.map);
        } else {
          let image = 'assets/imgs/blue-bike.png';
         // this.trackedRoute.push({ lat: data.latitude, lng: data.longitude });
          //this.redrawPath(this.trackedRoute);
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
         // console.log("2",updatelocation);
        //  this.map.setCenter(updatelocation);
         // this.map.setZoom(16);
          this.setMapOnAll(this.map);
        }
      }
      else{
        this.deleteMarkers();

      }
      });
    
     // this.deleteMarkers();
      /* let mapOptions = {
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
      }); */
    
    });
  }
 
  ionViewDidLoad() {
    this.plt.ready().then(() => {
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
        console.log("3",latLng);
        this.map.setCenter(latLng);
        this.map.setZoom(16);
       // this.trackedRoute.push({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      // this.redrawPath(this.trackedRoute);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }

  startLocating() {
    this.isTracking = true;
   // this.trackedRoute = [];
 
    // this.positionSubscription = this.geolocation.watchPosition()
    //   .pipe(
    //     filter((p) => p.coords !== undefined) //Filter Out Errors
    //   )
    //   .subscribe(data => {
    //     setTimeout(() => {
    //       this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
        
    //       this.redrawPath(this.trackedRoute);
    //     }, 0);
    //   });
 
  }

  // redrawPath(path) {
  //   if (this.currentMapTrack) {
  //     this.currentMapTrack.setMap(null);
  //   }
 
  //   if (path.length > 1) {
  //     this.currentMapTrack = new google.maps.Polyline({
  //       path: path,
  //       geodesic: true,
  //       strokeColor: '#ff00ff',
  //       strokeOpacity: 1.0,
  //       strokeWeight: 3
  //     });
  //     this.currentMapTrack.setMap(this.map);
  //   }
  // }
 
  stopLocating() {
    //let newRoute = { finished: new Date().getTime(), path: this.trackedRoute };
   // this.previousTracks.push(newRoute);
   // this.storage.set('routes', this.previousTracks);
   
    this.isTracking = false;
   // this.positionSubscription.unsubscribe();
   // this.currentMapTrack.setMap(null);
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
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



}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};