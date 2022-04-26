import { Injectable } from '@angular/core';
import {ModalController} from '@ionic/angular';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root',
})

/**
 * Servicio para gestión de páginas y componentes
 * a mostrar
 */
export class PageService {
  modalOp: boolean;

  constructor(
    private modalCrtl: ModalController,
  ) {}

  /**
   * Apertura Modal de FAQ
   *
   * @param compo Componente a mostrar
   * @param isEnable Menú extra empleados
   */
  async openFAQ(compo: any,isEnable: boolean) {
    this.modalOp = true;
    const faq = await this.modalCrtl.create({
      component: compo,
      componentProps: {menu:isEnable},
      backdropDismiss: true,
      mode: 'ios',
      cssClass: 'stlFAQ'
    });
    faq.present();
    await faq.onDidDismiss().then(async () => {
      this.modalOp = false;
    });
  }

  /**
   * Muestra la pantalla de los datos
   * del centro del empleado
   *
   * @param compo Componente a mostrar
   */
  async userMyData(compo: any){
    this.modalOp = true;
    const myData = this.modalCrtl.create({
      component: compo,
      backdropDismiss: true,
      mode: 'ios',
    });
    (await myData).present();
    await (await myData).onDidDismiss().then(()=>{
      this.modalOp = false;
    });
  }

  /**
   * Muestra la pantalla de lista de servicios
   *
   * @param compo Componente a mostrar
   */
  async listOfServices(compo: any){
    this.modalOp = true;
    const services = await this.modalCrtl.create({
      component: compo,
      id: 'servicesList',
      mode: 'ios',
      backdropDismiss: true
    });
    services.present();
    services.onDidDismiss().then(()=>{
      this.modalOp = false;
    });
  }

  /**
   * Muestra la pantalla de los incentivos
   *
   * @param compo Componente a mostrar
   */
  async employeeIncentives(compo: any){
    this.modalOp = true;
    const incentives = await this.modalCrtl.create({
      component: compo,
      mode: 'ios',
      backdropDismiss: true
    });
    incentives.present();
    await incentives.onDidDismiss().then(() => {
      this.modalOp = false;
    });
  }

  /**
   * Show screen rankings
   *
   * @param compo Componente a mostrar
   */
  async getRankings(compo: any){
    this.modalOp = true;
    const rankings = await this.modalCrtl.create({
      component: compo,
      mode: 'ios',
      backdropDismiss: true,
    });
    rankings.present();
    await rankings.onDidDismiss().then(() => {
      this.modalOp = false;
    });
  }

  /**
   * Show Centres League
   *
   * @param compo Componente a mostrar
   */
  async getClasificationLeague(compo: any){
    this.modalOp = true;
    const league = await this.modalCrtl.create({
      component: compo,
      // componentProps: {
      //   img: categoryImg,
      //   extra: extras,
      //   center: centro
      // },
      mode: 'ios',
      backdropDismiss: true,
      id: 'leagueCentres'
    });
    league.present();
    await league.onDidDismiss().then(() => {
      this.modalOp = false;
    });
  }



  /**
   * Recomendar servicios desde el listado
   *
   * @param compo Componente a mostrar
   * @param categoryImg Imagen categoria
   * @param extras Servicio a configurar
   * @param centro Centro realizador elegido
   */
  async recomendedService(compo: any, categoryImg: string, centro?: string, extras: Service = undefined, isRepeat = false) {
    this.modalOp = true;
    const newSale = await this.modalCrtl.create({
      component: compo,
      componentProps: {
        img: categoryImg,
        extra: extras,
        center: centro,
        repeat: isRepeat
      },
      mode: 'ios',
      backdropDismiss: true,
      id: 'forSale'
    });
    newSale.present();
    await newSale.onDidDismiss().then(() => {
      this.modalOp = false;
    });
  }

  async viewContentModal(compo: any, extras: any) {
    const confirmation = await this.modalCrtl.create({
      component: compo,
      componentProps: {data: extras},
      backdropDismiss: true,
      cssClass: 'confirmationStl',
      mode: 'ios'
    });
    confirmation.present();
    return await (await confirmation.onDidDismiss()).data;
  }

  // Cierre de componente
  closeModal(extra?: any) {
    this.modalOp = false;
    if (extra !== undefined) {
      this.modalCrtl.dismiss(extra);
    }
    this.modalCrtl.dismiss();
  }
}
