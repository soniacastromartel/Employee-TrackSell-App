import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Subscription } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { NO_CONNECTION } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  connectSubscription: Subscription;
  disconnectSubscription: Subscription;

  constructor(private net: Network, private noti: NotificationsService) {
    if (this.net.type === this.net.Connection.NONE) {
      this.noti.noConnectionDevice(NO_CONNECTION);
    }
    this.disconnectSubscription = this.net.onDisconnect().subscribe(() => {
      this.noti.noConnectionDevice(NO_CONNECTION);
    });
        this.connectSubscription = this.net.onConnect().subscribe(() => {
          this.noti.closeAlert();
    });
  }

/**
 * @returns is connected to wifi
 */
  typeConnection(){
    return this.net.type === this.net.Connection.WIFI;
  }
}
