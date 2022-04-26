import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsThrowsService {

  constructor(private alertCtrl: AlertController) { }

  async baseThrowAlerts(title: string, mensaje: string){
    const throwEjec = await this.alertCtrl.create({
      header: title,
      message: '<br>' + mensaje,
      backdropDismiss: false,
      mode: 'ios',
      id: 'notiError',
      cssClass: 'throwBaseStl',
      buttons: [{
        text: 'OK',
        role: 'cancel',
        cssClass: 'btnAlert',
        handler: () => {
          this.alertCtrl.dismiss();
        }
      }]
    });
    throwEjec.present();
    await throwEjec.onDidDismiss();
  }
}
