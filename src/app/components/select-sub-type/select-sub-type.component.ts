import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Service } from '../../models/service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-select-sub-type',
  templateUrl: './select-sub-type.component.html',
  styleUrls: ['./select-sub-type.component.scss'],
})
export class SelectSubTypeComponent implements OnInit {

  // Lista subtipos de servicios
  listOfSubtypes: any;

  constructor(private params: NavParams, private notification: NotificationsService) { }

  ngOnInit() {
    // Carga la lista de subtipo de servicios disponibles
    this.listOfSubtypes = this.params.get('collection');
  }

  /**
   * Retorna el servicio seleccionado
   *
   * @param service
   */
  selectService(service: Service){
    this.notification.closePopover(service);
  }

  /**
   * Close popover selection
   */
  closeSelection() {
    this.notification.closePopover();
  }
}
