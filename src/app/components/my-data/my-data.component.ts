/* eslint-disable @typescript-eslint/naming-convention */
import { SEND_MAIL } from './../../app.constants';
import { StorageService } from '../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { FaqComponent } from '../faq/faq.component';
import { Centre } from '../../models/centre';
import { UtilsService } from '../../services/utils.service';
import { Subscription } from 'rxjs';
import { CONTACT_SUPERVISOR, COPY_MAIL, BAD_OPERATION, CENTER_LABELS } from '../../app.constants';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.scss']
})
export class MyDataComponent implements OnInit {
  // Centro de empleado
  centro: Centre;
  centerLabels = CENTER_LABELS;




  constructor(
    private notification: NotificationsService,
    private storage: StorageService,
    private utils: UtilsService
  ) { }

  /**
   * Se recoge el centro del empleado para
   * mostrar su informacion
   */
  ngOnInit() {
    this.storage.currentUserListener.subscribe(res => {
      console.log(res);
        if(res){
          this.centro = res.centre;
        }else{
          this.centro = this.storage.center;
        }
      });
    
  }



  /**
   * Envío de email al centro o supervisor o
   * contacto con el centro de trabajo
   */
  async contactTo(mail: string) {
    let mailsCentro: string[];
    await this.notification.alertBaseQuestions(SEND_MAIL.title, SEND_MAIL.msg)
      .then(async (result) => {
        if (result) {
          if (mail.includes(';')) {
            mailsCentro = mail.split(';');
          }
          if (mailsCentro !== undefined) {
            await this.notification.selectMailSend(mailsCentro).then(selected => {
              if (selected !== undefined) {
                this.utils.sendMail(mail, COPY_MAIL, CONTACT_SUPERVISOR);
              }
            });
          } else {
            this.utils.sendMail(mail, COPY_MAIL, CONTACT_SUPERVISOR);
          }
        }
      }).catch(ex => {
        this.notification.baseThrowAlerts(BAD_OPERATION, ex);
      });
  }

  /**
   * Cerrar modal actual
   */
  goBack() {
    this.notification.closeModal();
  }


}
