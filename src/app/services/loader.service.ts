import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loadData: boolean;
  loadOp: boolean;

  constructor(public loadingController: LoadingController) { }

  // Simple loader
  simpleLoader() {
    this.loadingController.create({
      message: 'Loading...'
    }).then((response) => {
      response.present();
    });
  }

  // Dismiss loader
  async dismissLoader() {
    const loader = await this.loadingController.getTop();
    if (loader !== undefined) {
      this.loadingController.dismiss().then((response) => {
        console.log('Loader closed!', response);
      }).catch((err) => {
        console.log('Error occured : ', err);
      });
    }

  }

  // Auto hide show loader
  autoLoader() {
    this.loadingController.create({
      message: 'Loader hides after 4 seconds',
      duration: 4000
    }).then((response) => {
      response.present();
      response.onDidDismiss().then((response) => {
        console.log('Loader dismissed', response);
      });
    });
  }

  // Custom style + hide on tap loader
  customLoader() {
    this.loadingController.create({
      message: 'Loader with custom style',
      duration: 4000,
      cssClass: 'loader-css-class',
      backdropDismiss: true
    }).then((res) => {
      res.present();
    });
  }

  /**
  * Loads on updating the app version
  */
  async updatingApp() {
    this.loadOp = true;
    this.loadData = true;
    const updating = await this.loadingController.create({
      message: '<ion-label>ACTUALIZANDO</ion-label><br><ion-img src="assets/imgs/updating.gif"/>',
      cssClass: 'updatingStl',
      animated: true,
      mode: 'ios',
      translucent: true,
      showBackdrop: true,
      spinner: null,
      backdropDismiss: false,
      id: 'updateAniInfo'
    });
    updating.present();
    await updating.onDidDismiss().then(() => {
      this.loadOp = false;
      this.loadData = false;
    }, (ex) => {
      console.log(ex);
      this.loadOp = false;
      this.loadData = false;
    });
  }

/**
 * Loader de carga
 *
 * @param msg Mensaje a mostrar
 */
  async loadingData(msg: string) {
    this.loadOp = true;
    this.loadData = true;
    const load = await this.loadingController.create({
      message: msg,
      mode: 'ios',
      backdropDismiss: false,
      spinner: 'bubbles',
      cssClass: 'stlLoad'
    });
    load.present();
    await load.onDidDismiss().then(() => {
      this.loadOp = false;
      this.loadData = false;
    }, (ex) => {
      console.log(ex);
      this.loadOp = false;
      this.loadData = false;
    });
  }

}
