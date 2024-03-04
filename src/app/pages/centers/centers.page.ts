import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { MapComponent } from 'src/app/components/map/map.component';
import { DatacheckService } from 'src/app/services/datacheck.service';
import { environment } from 'src/environments/environment';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { NotificationsService } from 'src/app/services/notifications.service';
import axios from 'axios';

@Component({
  selector: 'app-centers',
  templateUrl: './centers.page.html',
  styleUrls: ['./centers.page.scss'],
})
export class CentersPage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('modal') modalRef: ModalController;
  map: GoogleMap;
  markers: Marker[];
  coordinates: LatLng;
  apiKey: string;

  constructor(
    private modal: ModalController,
    private datacheck: DatacheckService,
    private actionSheet: ActionSheetController,
    private notification: NotificationsService
  ) { }

  ngOnInit() {
    this.apiKey = environment.mapsKey;
    this.loadMarkers();
  }

  ionViewDidEnter() {
    this.getCurrentPosition().then((coordinates) => {
      console.log(coordinates);
      this.coordinates = coordinates;
      this.createMap();
    });
  }

  ionViewDidLeave() {
    this.map.destroy();
  }

  async loadMarkers() {
    this.markers = await this.datacheck.getLocations().toPromise();
  }

  /* The `async createMap()` function in the `CentersPage` class is responsible for creating a Google Map
  instance using the Capacitor Google Maps plugin.
   */
  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: this.apiKey,
      element: this.mapRef.nativeElement,
      config: {
        center: this.coordinates,
        zoom: 10,
      },
    });
    const currentLocation = await this.getAddressFromCoords(this.coordinates.lat, this.coordinates.lng);
    this.addMarkers([...this.markers, this.createUserMarker()]);
    this.setMarkerClickListener();
    console.log(currentLocation);
  }

  /* The `createUserMarker(): Marker` function in the `CentersPage` class is a method that returns a
  `Marker` object representing the user's current position on the Google Map
  */
  createUserMarker(): Marker {
    return {
      coordinate: this.coordinates,
      title: 'Tu posición'.toUpperCase(),
      snippet: 'Usted está aquí: ',
      iconUrl: 'http://maps.gstatic.com/mapfiles/ms2/micons/blue-pushpin.png',
    };
  }

  addMarkers(markers: Marker[]) {
    this.map.addMarkers(markers);
  }

  /* The `setMarkerClickListener()` function in the `CentersPage` class is setting up a listener for when
  a marker on the Google Map is clicked. Here's a breakdown of what it does: */
  setMarkerClickListener() {
    let snippet: string = '';
    this.map.setOnMarkerClickListener(async (marker) => {
      console.log(marker);
      this.markers.forEach(mark => {
        if (mark.title == marker.title) {
          snippet = mark.snippet;
        }
      });
      if (marker.title == 'Tu posición'.toUpperCase()) {
        let text = await this.getAddressFromCoords(marker.latitude, marker.longitude);
        snippet = 'Usted está aquí: ' + text.slice(0, 20) + '...';
        console.log(snippet);
      }
      this.notification.locationActionSheet(marker.title, snippet);
    });
  }

  /* The `async getCurrentPosition(): Promise<LatLng>` function is a method in the `CentersPage` class of
  a TypeScript file. This function is responsible for retrieving the current geolocation position of
  the user using the Capacitor Geolocation plugin. */
  async getCurrentPosition(): Promise<LatLng> {
    try {
      const currentPosition: GeolocationPosition = await Geolocation.getCurrentPosition();
      return {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude,
      };
    } catch (error) {
      alert(error.message);
      console.error('Error getting current position:', error);
      return null;
    }
  }

  /* The `async getAddressFromCoords(latitude: number, longitude: number): Promise<string>` function is
  using the `axios` library to make an asynchronous HTTP GET request to the Google Maps Geocoding API.
  It sends a request to retrieve the address information based on the provided latitude and longitude
  coordinates. The function returns a Promise that resolves to a string representing the formatted
  address corresponding to the given coordinates. */
  async getAddressFromCoords(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return 'No address found';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    }
  }

}
