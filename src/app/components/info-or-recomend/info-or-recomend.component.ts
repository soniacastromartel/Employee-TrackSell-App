import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { NavParams } from '@ionic/angular';
import { Service } from '../../models/service';

@Component({
  selector: 'app-info-or-recomend',
  templateUrl: './info-or-recomend.component.html',
  styleUrls: ['./info-or-recomend.component.scss'],
})
export class InfoOrRecomendComponent implements OnInit {
  availablesServices: Array<Service>;

  constructor(private noti: NotificationsService,
            private params: NavParams) { }

  /**
   * Se recogen los servicios disponible
   */
  ngOnInit(){
    this.availablesServices = this.params.get('extra');
  }

  /**
   * User selection
   *
   * @param service Servicio seleccionado
   * @returns Option of user
   */
  async userOption(service: Service) {
    return this.closePopover(service);
  }

  /**
   * Close alert
   */
  closePopover(extra?) {
    this.noti.closePopover(extra);
  }

}
