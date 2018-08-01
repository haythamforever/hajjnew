import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DriverPage } from '../pages/driver/driver';
import { RiderPage } from '../pages/rider/rider';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
	DriverPage,
	RiderPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
	 IonicStorageModule.forRoot()
   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
	DriverPage,
	RiderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  Geolocation,
  Device
  ]
})
export class AppModule {}
