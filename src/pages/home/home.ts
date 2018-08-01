import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RiderPage } from '../rider/rider';
import { DriverPage } from '../driver/driver';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  
  LoginRider()
  {  
  console.log("Rider");
	  this.navCtrl.push(RiderPage);
	 
	  
  }
  
  LoginDriver()
  {
	    console.log("Driver");
	  this.navCtrl.push(DriverPage);
	
	  
  }

}
