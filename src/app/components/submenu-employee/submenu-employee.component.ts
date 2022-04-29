import { Component } from '@angular/core';
import { PhoneService } from '../../services/phone.service';
import { PageService } from '../../services/page.service';
import { BoardSupervisorComponent } from '../board-supervisor/board-supervisor.component';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-submenu-employee',
  templateUrl: './submenu-employee.component.html',
  styleUrls: ['./submenu-employee.component.scss'],
})
export class SubmenuEmployeeComponent {
  optsEmployeeSubMenu = [
    { title: 'CONTACTAR CON MI CENTRO', ic: 'call'},
    { title: 'AVISOS DE SUPERVISOR/A', ic: 'alert-circle' },
  ];

  constructor(private call: PhoneService,
              private pageSvc: PageService,
              private notification: NotificationsService) {}

  actionsTo(opt: number){
    switch (opt){
      case 0:
        this.callingToCenter();
        break;
        case 1:
        this.openBoard();
        break;
    }
  }

  /**
   * Realiza la llamada al centro del empleado.
   */
  callingToCenter(){
    // RECOGER NÚMERO CENTRO EMPLEADO ACTIVO.
    this.call.makeCall('626626626');
  }

  openBoard(){
    this.pageSvc.openBoard(BoardSupervisorComponent);
    this.notification.closePopover();
  }

}
