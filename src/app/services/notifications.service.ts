/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import { PageService } from './page.service';
import { Service } from '../models/service';
import { UPDATE_NOT_ALLOW, INFO_WIFI_REQUIRED_UPDATE } from '../app.constants';
import {
  CREDENTIALS_NOT_SAME, CONFIRM_USERNAME, INSERT_USERNAME, PLACEHOLDER_USERNAME,
  TITLE_UPDATE, INFO_UPDATE, CREDENTIALS_FORMAT_ERROR, CREDENTIALS_EMPTY
} from '../app.constants';
import {
  AlertController,
  LoadingController,
  ModalController,
  PopoverController,
  ToastController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})

/**
 * Servicio dedicado para las notificaciones y
 * alertas de usuario
 */
export class NotificationsService {
  alertOp: boolean;
  modalOp: boolean;
  loadOp: boolean;
  popoOp: boolean;
  extraData: string;
  exitPresent: boolean;
  loadData: boolean;

  constructor(
    protected alertCtrl: AlertController,
    public modalCrtl: ModalController,
    protected loadingCtrl: LoadingController,
    protected popoCtrl: PopoverController,
    protected toastCtrl: ToastController,
    public pageSvc: PageService
  ) { }

  /**
   * Informa al usuario de nueva
   * version estable de la app
   */
  async updateApp(force: boolean) {
    this.alertOp = true;
    let buttons = [];
    if (!force) {
      buttons = [
        {
          text: 'DESCARGAR',
          role: 'download',
          cssClass: 'btnAlert',
          handler: (data) => {
            return data;
          }
        }, {
          text: 'DESCARGAR MÁS TARDE',
          role: 'later',
          cssClass: 'btnLater'
        }
      ];
    } else {
      buttons = [
        {
          text: 'DESCARGAR',
          role: 'download',
          cssClass: 'btnAlert',
          handler: (data) => {
            return data;
          }
        }
      ];
    }
    const updating = await this.alertCtrl.create({
      header: TITLE_UPDATE,
      message: INFO_UPDATE,
      backdropDismiss: false,
      cssClass: 'updateStl',
      id: 'infoUpdate',
      mode: 'ios',
      buttons: buttons
    });
    await updating.present();
    return await updating.onDidDismiss();
  }

  /**
   * Loads on updating the app version
   */
  async updatingApp() {
    this.loadOp = true;
    this.loadData = true;
    const updating = await this.loadingCtrl.create({
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
   * Informa al usuario de nueva
   * version estable de la app
   */
  async notAllowUpdate() {
    this.alertOp = true;
    const updating = await this.alertCtrl.create({
      header: UPDATE_NOT_ALLOW,
      message: INFO_WIFI_REQUIRED_UPDATE,
      backdropDismiss: false,
      cssClass: 'updateStl',
      id: 'infoUpdate',
      mode: 'ios',
      buttons: [, {
        text: 'OK',
        cssClass: 'btnLater'
      }
      ]
    });
    await updating.present();
    return await updating.onDidDismiss().then(() => {
      this.alertOp = false;
    });
  }

  /**
   * Recordar contraseña
   */
  async rememberPass(employeeData: any) {
    let data;
    const msg = (employeeData !== undefined && employeeData.username !== null) ? '<br><label>' + CONFIRM_USERNAME + '</label>' : '<br><label>' + INSERT_USERNAME + '</label>';
    const userPlaceholder = (employeeData !== undefined && employeeData.username !== null) ? employeeData.username : PLACEHOLDER_USERNAME;
    this.alertOp = true;
    const rememberPs = await this.alertCtrl.create({
      header: 'RECUPERACIÓN DE CONTRASEÑA',
      message: msg,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'stlRemeberPass',
      inputs: [
        {
          name: 'username',
          type: 'text',
          cssClass: 'alertStl',
          placeholder: userPlaceholder,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'btnCancel',
          handler: () => {
            this.closeAlert(undefined);
          },
        },
        {
          text: 'Aceptar',
          cssClass: 'btnAlert',
          handler: (dt) => {
            data = dt.username;
          }
        },
      ],
    });
    rememberPs.present();
    await rememberPs.onDidDismiss().then(() => {
      this.alertOp = false;
    });
    return data;
  }

  /**
   * Menú extra empleados (FAQ)
   */
  async subMenuEmployee(compo: any, ev: any) {
    this.popoOp = true;
    const menuEmployee = await this.popoCtrl.create({
      component: compo,
      mode: 'ios',
      backdropDismiss: true,
      event: ev,
      translucent: true,
      cssClass: 'popoverMenuEmployee',
    });
    menuEmployee.present();
    await menuEmployee.onDidDismiss().then(() => {
      this.popoOp = false;
    });
  }

  /**
   * Toast informativo para mostrar más info
   * si se realiza click en la tabla
   */
  async showAlertMoreInfo() {
    const moreInfo = await this.toastCtrl.create({
      message: 'CLICK PARA MÁS INFO<ion-img src="assets/imgs/dedo.png"/>',
      mode: 'ios',
      duration: 900,
      animated: true,
      position: 'bottom',
      translucent: true,
      cssClass: 'moreInfoStl'
    });
    moreInfo.present();
  }

  async alertChangeList(title: string, subtitle: string, changeList: string) {
    this.alertOp = true;
    const invalid = await this.alertCtrl.create({
      message: '<ion-icon name="cog" class="ic1"></ion-icon><ion-icon name="cog" class="ic2"></ion-icon><h5>' + title + '</h5>' + '<ion-note class="subtitle">' + subtitle + '</ion-note><br><br><ion-note>' + changeList + '</ion-note>',
      cssClass: 'changingListStl',
      backdropDismiss: false,
      mode: 'ios',
      buttons: [
        {
          text: 'OK',
          cssClass: 'btnAlert',
          handler: () => {
            this.closeAlert();
          },
        },
      ],
    });
    invalid.present();
    await invalid.onDidDismiss().then(() => {
      this.alertOp = false;
    });
  }

  /**
   * Notificación reuitilizable
   *
   * @param title Título notificación
   * @param msg Mensaje notificación
   * @param isBloqued variable de control cuenta bloqueada
   */
  async alertBaseNotifications(title: string, msg: string, isLocked: boolean = false, isRequested: boolean = false, data?: any) {
    this.alertOp = true;
    let buttons = [];
    if (!isLocked) {
      buttons = [
        {
          text: 'OK',
          cssClass: 'btnAlert',
          handler: () => {
            this.closeAlert();
          },
        },
      ];
    } else {
      buttons = [
        {
          text: 'SOLICITAR',
          cssClass: 'btnAlert',
        },
      ];
    }
    const baseAlert = await this.alertCtrl.create({
      header: title,
      message: '<br><ion-note>' + msg + '</ion-note>',
      cssClass: 'baseNotification',
      backdropDismiss: false,
      mode: 'ios',
      buttons: buttons
    });
    await baseAlert.present();
    return await baseAlert.onDidDismiss();
  }

  /**
   * Notificacion reutilizable para
   * alerta de preguntas
   */
  async alertBaseQuestions(title: string, question: string, extra: string = null) {
    let userOption = false;
    this.alertOp = true;
    const msg = extra === null ? '<br>' + question : '<br>' + question + extra;
    const questions = await this.alertCtrl.create({
      header: title,
      message: msg,
      mode: 'ios',
      cssClass: 'questionsStl',
      backdropDismiss: true,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'btnQuestion',
          handler: () => {
            this.closeAlert();
          }
        },
        {
          text: 'SI',
          cssClass: 'btnQuestion',
          handler: () => {
            userOption = true;
          }
        }
      ]
    });
    questions.present();
    await questions.onDidDismiss().then(() => {
      this.alertOp = false;
    });
    return userOption;
  }

  /**
   * Loader de carga
   *
   * @param msg Mensaje a mostrar
   */
  async loadingData(msg: string) {
    this.loadOp = true;
    this.loadData = true;
    const load = await this.loadingCtrl.create({
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
      this.loadOp = false;
      this.loadData = false;
    });
  }

  /**
   * Notificación de contenido (FAQ)
   *
   * @param title Título a mostrar
   * @param question Contenido a mostrar
   */
  async showQuestionFAQ(compo: any, category: string, title: string, answer: string, imgs: string[]) {
    this.modalOp = true;
    const infoFAQ = await this.modalCrtl.create({
      component: compo,
      componentProps: { data: { title: category, pregunta: title, respuesta: answer, images: imgs } },
      backdropDismiss: true
    });
    infoFAQ.present();
    infoFAQ.onDidDismiss().then(() => {
      this.modalOp = false;
    });
  }

  /**
   * Notificación de cambio de contraseña personal
   *
   * @param compoAux Componente auxiliar para comprobacion
   * @returns Información definida
   */
  async userChangePass(compoAux: any) {
    const changePass = await this.alertCtrl.create({
      header: 'DEFINICIÓN DE CONTRASEÑA',
      message: 'Por favor, establezca una contraseña personal',
      mode: 'ios',
      backdropDismiss: false,
      cssClass: 'userNotifications',
      inputs: [
        {
          name: 'pass1',
          type: 'password',
          id: 'pass1',
          cssClass: 'stlInput',
          placeholder: 'Contraseña'
        },
        {
          name: 'pass2',
          type: 'password',
          id: 'pass2',
          cssClass: 'stlInput',
          placeholder: 'Repita su contraseña aquí'
        },
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'btnCancel',
          handler: (data) => {
            this.closeAlert();
            return undefined;
          }
        },
        {
          text: 'ESTABLECER',
          cssClass: 'btnAlert',
          handler: (data) => {
            if (data.pass1 !== '' && data.pass2 !== '') {
              if (data.pass1 === data.pass2) {
                if (compoAux.formatPass(data.pass1)) {
                  return data;
                } else {
                  this.alertBaseNotifications(CREDENTIALS_FORMAT_ERROR.title, CREDENTIALS_FORMAT_ERROR.msg);
                }
              } else {
                this.alertBaseNotifications(CREDENTIALS_NOT_SAME.title, CREDENTIALS_NOT_SAME.msg);
              }
            } else {
              this.alertBaseNotifications(CREDENTIALS_EMPTY.title, CREDENTIALS_EMPTY.msg);
            }
            return false;
          }
        }
      ]
    });
    changePass.present();
    return (await changePass.onDidDismiss()).data;
  }

  /**
   * Alerta bloqueante dispositivo sin conexion
   */
  async noConnectionDevice(data: any) {
    const noCon = await this.alertCtrl.create({
      // eslint-disable-next-line max-len
      message: '<h5>' + data.title + '</h5><ion-note>' + data.subtitle + '</ion-note><br><br><ion-label>' + data.msg + '</ion-label><img src="' + data.ic + '"/>',
      mode: 'ios',
      id: 'noCon',
      backdropDismiss: false,
      cssClass: 'noConStl',
      animated: true
    });

    noCon.present();
  }


  /**
   * Confirmación de operación
   *
   * @param title Titulo alerta
   * @param msg Mensaje de alerta
   */
  async operationConfirmation(title: string, msg: string) {
    const confirmation = await this.toastCtrl.create({
      header: title,
      message: msg,
      mode: 'ios',
      cssClass: 'toastStl',
      position: 'bottom',
      buttons: [
        {
          text: 'OK',
          cssClass: 'bntAlert',
          handler: () => {
            this.toastCtrl.dismiss();
          }
        }
      ]
    });
    await confirmation.present();
  }

  /**
   * Muestra los subtipos de servicios disponible
   *
   * @param compo Componente a mostrar
   * @param services Servicios disponibles
   */
  async showAvailablesServices(compo: any, services: Array<Service>) {
    let extra: any;
    this.popoOp = true;
    const availables = await this.popoCtrl.create({
      component: compo,
      componentProps: { extra: services },
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'tableServices'
    });
    availables.present();
    await availables.onDidDismiss().then((data) => {
      this.popoOp = false;
      extra = data.data;
      return data;
    });
    return extra;
  }

  /**
   * Notificacion de eleccion de informacion o recomendacion
   * de servicio
   *
   * @param compo Componente a mostrar
   * @param serviceName Nombre del servicio elegido
   * @param ev Desde donde nace la notificacion
   * @returns Eleccion usuario
   */
  async infoOrRecommend(compo: any, serviceName: string, ev: any) {
    this.popoOp = true;
    let data: any;
    const recomend = await this.popoCtrl.create({
      component: compo,
      componentProps: { extra: serviceName },
      backdropDismiss: true,
      event: ev,
    });
    recomend.present();
    await recomend.onDidDismiss().then((rslt) => {
      this.popoOp = false;
      data = rslt.data;
    });
    return data;
  }

  /**
   * Alerta de seleccion de subtipo de servicio a
   * recomendar
   *
   * @param compo Componente a mostrar
   * @param services Servicios disponibles
   */
  async selectSubTypeService(compo: any, services: Service[]) {
    this.popoOp = true;
    let selection;
    const selectService = await this.popoCtrl.create({
      component: compo,
      componentProps: { collection: services },
      mode: 'ios',
      cssClass: 'selectorService',
      backdropDismiss: true,
    });

    selectService.present();
    await selectService.onDidDismiss().then((data) => {
      this.popoOp = false;
      selection = data.data;
    });
    return selection;
  }

  /**
   * Informacion detallada de servicio
   *
   * @param data Informacion de servicio a mostrar
   */
  async infoEmployeeService(data: any) {
    this.alertOp = true;
    const infoES = await this.alertCtrl.create({
      header: data.service.toUpperCase(),
      message: '<br><ion-grid><ion-row><ion-col class="dataCol">' + '</ion-col></ion-row><ion-row><ion-col class="lblCol" size="2"><ion-note>FECHA: </ion-note></ion-col><ion-col class="dataCol" size="10">' + data.started_date + '</ion-col></ion-row><ion-row><ion-col class="lblCol" size="2"><ion-note>PACIENTE:</ion-note></ion-col><ion-col class="dataCol" size="10">' + data.patient_name.toUpperCase() + '</ion-col></ion-row><ion-row><ion-col class="lblCol" size="2"><ion-note>PRECIO:</ion-note></ion-col><ion-col class="dataCol" size="10">' + (data.price !== undefined ? data.price + ' X ' + data.quantity + ' = ' + (data.price * data.quantity) + ' €' : '-') + '</ion-col></ion-row><ion-row><ion-col class="lblCol" size="2"><ion-note>INCENTIVOS:</ion-note></ion-col><ion-col class="dataCol" size="10">' + data.incentive + ' €</ion-col></ion-row><ion-row><ion-col class="lblCol" size="2"><ion-note>ESTADO: </ion-note></ion-col><ion-col class="dataCol" size="10">' + data.state.toUpperCase() + '</ion-col></ion-row><ion-row><ion-col class="lblCol" size="2"><ion-note>ACTUALIZACIÓN: </ion-note></ion-col><ion-col class="dataCol" size="10">' + data.date + '</ion-col></ion-row></ion-grid>',
      backdropDismiss: true,
      cssClass: 'stlEmployeeService',
      mode: 'ios',
      buttons: [
        {
          text: 'REPETIR SERVICIO',
          role: 'repeat',
          cssClass: 'btnAlert'
        },
        {
          text: 'CERRAR',
          role: 'cancel',
          cssClass: 'btnCancel'
        }
      ]
    });

    infoES.present();
    await infoES.onDidDismiss().then((d) => {
      this.alertOp = false;
      this.extraData = d.role;
    });
    return this.extraData;
  }

  /**
   * Toast Reutilizable
   * @param header encabezado
   * @param info mensaje a mostrar
   */
  async toastBaseInfo(header: string, info: string, position: any) {
    this.alertOp = true;
    const infoToast = await this.toastCtrl.create({
      header: header,
      message: '<br>' + info,
      duration: 4000,
      animated: true,
      cssClass: 'toastNotifications',
      mode: 'ios',
      position: position,
    });
    infoToast.present();
    infoToast.onDidDismiss().then(() => {
      this.alertOp = false;
    });
  }

  /**
   * Alerta solicitar acceso
   */
  async requestAccess() {
    this.alertOp = true;
    const accessForEmployee = await this.alertCtrl.create({
      header: 'IDENTIFICACIÓN',
      message: 'Por favor, introduzca los siguientes datos:',
      backdropDismiss: false,
      mode: 'ios',
      cssClass: 'requestAccessStl',
      inputs: [
        {
          type: 'text',
          placeholder: 'DNI',
          id: 'dni',
          label: 'DNI*:',
          name: 'dni',
          cssClass: 'stlInput'
        },
        {
          type: "text",
          placeholder: 'Nombre y Apellidos completos',
          id: 'name',
          name: 'name',
          label: 'Nombre: ',
          cssClass: 'stlInput',
        }
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'btnCancel'
        },
        {
          text: 'SOLICITAR',
          cssClass: 'btnAlert',
          handler: (data) => {
            return data;
          }
        }
      ]
    });

    accessForEmployee.present();
    return await accessForEmployee.onDidDismiss().then(data => {
      this.alertOp = false;
      return data;
    });
  }

  /**
   * Reseteo para solicitud de acceso
   *
   * @param title Título alerta
   * @param msg Mensaje de alerta
   * @returns User selection
   */
  async resetRequestAccess(title: string, msg: string) {
    this.alertOp = true;
    const resetRequest = await this.alertCtrl.create({
      header: title,
      message: '<br><strong>' + msg + '</strong><br>',
      mode: 'ios',
      backdropDismiss: true,
      cssClass: 'retrySend',
      inputs: [{
        type: 'checkbox',
        id: 'checkbox',
        name: 'checkbox',
        checked: false,
        label: 'REENVIAR SOLICITUD',
        cssClass: 'checkStl'
      }],
      buttons: [{
        text: 'CANCELAR',
        role: 'cancel',
        cssClass: 'btnCancel',
        handler: () => {
          return undefined;
        }
      }, {
        text: 'OK',
        cssClass: 'btnAlert',
        handler: () => {
          return true;
        }
      }]
    });

    resetRequest.present();
    return await resetRequest.onDidDismiss().then((data) => {
      this.alertOp = false;
      return data;
    });
  }

  /**
   * Aviso inicial politica de privacidad
   *
   * @param privacyInfo Informacion politica de privacidad
   * @param cp Componente a mostrar
   * @returns Accion user
   */
  async showPrivacy(privacyInfo: any) {
    let extraData;
    const privacy = await this.alertCtrl.create({
      header: privacyInfo.title,
      subHeader: privacyInfo.extra,
      message: privacyInfo.msg,
      mode: 'md',
      backdropDismiss: false,
      keyboardClose: true,
      cssClass: 'stlPrivacy',
      buttons: [
        {
          text: 'DENEGAR',
          cssClass: 'btnPrivacyF',
          handler: () => {
            extraData = false;
          }
        },
        {
          text: 'ACEPTAR',
          cssClass: 'btnPrivacyT',
          handler: () => {
            extraData = true;
          }
        }
      ]
    });
    privacy.present();
    await privacy.onDidDismiss();

    return extraData;
  }

  async baseThrowAlerts(title: string, mensaje: string) {
    const throwEjec = await this.alertCtrl.create({
      message: '<ion-icon name="alert-circle"></ion-icon><br><h6>' + title + '</h6>' + '<br>' + mensaje,
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

  /**
   * Alerta para elegir destinatario de correo
   *
   * @param mails Coleccion de mails disponible para
   * enviar
   * @returns Correo a enviar el mail
   */
  async selectMailSend(mails: string[]) {
    this.alertOp = true;
    let dataAux;
    const sendingMail = await this.alertCtrl.create({
      header: 'SELECCIONAR DESTINATARIO',
      message: 'Elegir una opción',
      mode: 'ios',
      cssClass: 'multiMailStl',
      backdropDismiss: false,
      inputs: [
        {
          type: 'radio',
          cssClass: 'inputStl',
          value: mails[0],
          name: 'mail1',
          label: mails[0],
          handler: () => {
            dataAux = mails[0];
            this.alertCtrl.dismiss();
          }
        },
        {
          type: 'radio',
          cssClass: 'inputStl',
          value: mails[1],
          name: 'mail2',
          label: mails[1],
          handler: () => {
            dataAux = mails[1];
            this.alertCtrl.dismiss();
          }
        }
      ]
    });
    await sendingMail.present();
    return await sendingMail.onDidDismiss().then(() => {
      this.alertOp = false;
      return dataAux;
    });
    return dataAux;
  }

  /**
   * Salir de la app
   *
   * @returns Eleccion del usuario
   */
  async exitApp() {
    let dataResult: boolean;
    if (!this.alertOp && !this.modalOp && !this.popoOp && !this.loadOp && !this.pageSvc.modalOp) {
      this.exitPresent = true;
      const exit = await this.alertCtrl.create({
        header: '¿SALIR?',
        message: '<br><ion-note>¿DESEA SALIR DE LA APLICACIÓN?</ion-note>',
        mode: 'ios',
        cssClass: 'exitAppStl',
        id: 'exitAlert',
        backdropDismiss: true,
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            cssClass: 'alertBtn',
            handler: () => {
              this.closeAlert();
            },
          },
          {
            text: 'SI',
            cssClass: 'alertBtn',
            handler: () => {
              dataResult = true;
            },
          },
        ],
      });
      exit.present();
      await exit.onDidDismiss().then(() => {
        this.exitPresent = false;
      });
    }
    return dataResult;
  }

  infoNotifications() {
    return (!this.alertOp &&
      !this.modalOp && !this.popoOp &&
      !this.loadOp && !this.pageSvc.modalOp);
  }

  /** CIERRES NOTIFICATIONS, MODALS Y OTHERS**/

  generallyClose() {
    this.closeAlert();
    this.closeModal();
    this.closePopover();
  }

  async closeModal(extra?) {
    const modaling = await this.modalCrtl.getTop();
    if (extra !== undefined) {
      await this.modalCrtl.dismiss(extra);
    } else {
      if (modaling !== undefined) {
        await this.modalCrtl.dismiss();
      }
    }
  }

  async closeAlert(extra?) {
    const alerting = await this.alertCtrl.getTop();
    if (alerting !== undefined) {
      await this.alertCtrl.dismiss();
    }
  }

  // async cancelLoad() {
  //   const loader = await this.loadingCtrl.getTop();
  //   if (loader !== undefined) {
  //     await this.loadingCtrl.dismiss();
  //   }
  // }

  async closePopover(extra?) {
    const notification = await this.popoCtrl.getTop();
    if (notification !== undefined) {
      await this.popoCtrl.dismiss(extra);
    }
  }

  async contentFileEnvironment() {
    const environmentData = await this.alertCtrl.create({
      header: 'ENVIRONMENT DATA',
      message: 'Introduzca la url a definir en el archivo environment',
      mode: 'ios',
      backdropDismiss: false,
      cssClass: 'stlEnvironment',
      inputs: [
        {
          type: 'url',
          placeholder: 'URL aquí',
          id: 'urlEnvironment',
          cssClass: 'environmentStl'
        }
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'btnCancel'
        },
        {
          text: 'OK',
          role: 'accept',
          cssClass: 'btnAlert',
          handler: data => {
            this.closeAlert(data);
          }
        },
        {
          text: 'BORRAR ARCHIVO',
          role: 'delete',
          cssClass: 'btnDelete'
        }
      ]
    });
    await environmentData.present();
    return await environmentData.onDidDismiss().catch(() => {
      return undefined;
    });
  }
}
