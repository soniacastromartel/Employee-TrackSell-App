import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Platform } from '@ionic/angular';
import { NotificationsService } from 'src/app/services/notifications.service';
import { environment } from 'src/environments/environment';
// import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from '@ionic-native/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input () marker:any;

  constructor(private notification: NotificationsService) { }

  ngOnInit() {
  }

goBack() {
  this.notification.closeModal();
}

}
