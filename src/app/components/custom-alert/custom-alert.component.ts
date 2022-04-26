import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { NavParams } from '@ionic/angular';
import { RETRY_SEND_REQUEST } from '../../app.constants';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.scss'],
})
export class CustomAlertComponent implements OnInit {

  dataAlert = {
    ic: undefined,
    title: undefined,
    msg: undefined
  };

  retryLabel = RETRY_SEND_REQUEST;

  retrySend = false;

  constructor(private noti: NotificationsService, private params: NavParams) { }

  ngOnInit() {
    this.dataAlert.ic = this.params.get('icon');
    this.dataAlert.title = this.params.get('titulo');
    this.dataAlert.msg = this.params.get('message');
  }

  action(opt: boolean) {
    this.noti.closePopover({ role: opt, data: this.retrySend });
  }

}
