import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyD0xkPsOVP_qk8SFdcn_SOn0NAaPnXDrnw",
  authDomain: "italytracker-b015d.firebaseapp.com",
  databaseURL: "https://italytracker-b015d.firebaseio.com",
  projectId: "italytracker-b015d",
  storageBucket: "italytracker-b015d.appspot.com"
};

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(config);

  }
}

