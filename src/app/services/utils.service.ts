/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { MIN_VERSION_APP, PASS_FORMAT, BASE_UPDATE_LINK, BASE_URL, TIME_OUT_RESPONSE,
  ANDROID_ENVIRONMENT_FILE_PATH, LOADING_CONTENT, UPDATE_ERROR,
  UPDATE_MAX_TIME_LOADING, ENVIRONMENT_FILENAME, IOS_ENVIRONMENT_FILEDIR_PATH, ERROR_WRITE_FILE,
  CONFIRMATION_DELETE_IOS_FILE, ERROR, FILE_NOT_EXISTS, SESION_EXPIRED, MAIL_TO, CC_MAIL, SUBJECT_MAIL, UPDATE_VALID,
  ANDROID_TYPE, IOS_TYPE, DOWNLOAD_VALID, ERROR_DOWNLOAD_UPDATE, ERROR_CANCEL_UPDATE, SERVER_NO_AVAILABLE,INFO_MODEL,
  INFO_UUID, INFO_MANUFACTURE, INFO_VERSION, INFO_SYSTEM, IC_ARROW_DOWN, IC_ARROW_UP, NONE,
  SCROLLING_TIME,
  DEFAULT_TIME_1S,
  LOG_TYPE,
  LOG_PLACE,
  COLLECTING_INFO,
  MAX_TIME_LOADING,
  NORMAL_TIME_WAIT,
  BASE_UPATE_IOS_PWA_LINK,
  REQUEST_IN_PROCESS} from '../app.constants';
import { NotificationsService } from './notifications.service';
import { AccessToService } from './access-to.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { DatacheckService } from './datacheck.service';
import ApkUpdater from 'cordova-plugin-apkupdater';
import { Platform, IonContent } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File, DirectoryEntry} from '@ionic-native/file/ngx';
import { StorageService } from './storage.service';
import { ConnectionService } from './connection.service';
import { Error } from '../models/Error';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  // Control timeOut
  timeControl;
   // Version app
  version: string;
  // Scroll Type
  typeScroll: string;
  // Objeto auxiliar de control de icon arrow
  timeOutArrow;

  // Variable de control para actualizacion pospuesta
  pendingUpdate = false;

  // Base Url
  base = '';

  // // Options slide notices/promotions and images FAQ Viewew
   slideOpts = {
    initialSlide: 0,
    speed: DEFAULT_TIME_1S
  };

  constructor(
    private storage: StorageService,
    private notification: NotificationsService,
    private accesstInfo: AccessToService,
    private appVersion: AppVersion,
    private checkSvc: DatacheckService,
    private platform: Platform,
    private iab: InAppBrowser,
    private file: File,
    private connection: ConnectionService) {}

    /**
     * Metodo auxiliar para el control accesos
     */
    async maxAccessPermited(accesos: number){
      if (accesos >= 3) {
        this.storage.employeeListener.next(undefined);
        this.notification.alertBaseNotifications(SESION_EXPIRED.title, SESION_EXPIRED.msg);
        return {block: true};
      } else{
        return true;
      }
    }

  /* Recoge la versión actual de la app
     * y en caso de error muestra la versión
     * mínima.
     */
  async getVersionApp() {
  return await this.appVersion
  .getVersionNumber()
    .then((result) => {
      this.version = result;
      return this.version;
    })
    .catch((ex) => {
      this.version = MIN_VERSION_APP;
      return this.version;
    });
  }

  /**
   * Escucha scroll y en función de 'direction' asigna el icono de flecha arriba o flecha abajo
   *
   * @param ev Evento touch
   */
    onScroll(ev: any, content: IonContent){
    let direction;
    if(ev.detail.deltaY > 0){
      direction = 1; //down
    } else if(ev.detail.deltaY < 0){
      direction = 2; //up
    }
    switch(direction){
      case 1:
        this.typeScroll = IC_ARROW_DOWN;
        break;
      case 2:
        this.typeScroll = IC_ARROW_UP;
        break;
    }
      this.detectBottom(content);
  }

  /**
   * Scroll in lista de rankings
   */
    onScrolling(content: IonContent){
    if(this.typeScroll !== NONE){
      if(this.typeScroll === IC_ARROW_UP){
        content.scrollToTop(SCROLLING_TIME);
      } else{
        content.scrollToBottom(SCROLLING_TIME);
      }
      setTimeout(() => {
        this.typeScroll = NONE;
      },SCROLLING_TIME);
    }
  }

  /**
   * Detecta el final de página
   */
    async detectBottom(content: IonContent) {
    const scrollElement = await content.getScrollElement();
    if (
      (scrollElement.scrollTop ===
      scrollElement.scrollHeight - scrollElement.clientHeight)
    ) {
      this.typeScroll = NONE;
    }
  }

  /**
   * Oculta el icono de flecha para
   * subir o bajar de la lista
   */
    hiddenArrow(){
      // eslint-disable-next-line eqeqeq
      if(this.timeOutArrow != undefined){
        clearTimeout(this.timeOutArrow);
      }
      this.timeOutArrow = setTimeout(() => {
        this.typeScroll= NONE;
      },1500);
    }

  /**
   * Creacion del objeto de informacion del dispositivo
   *
   * @param info Informacion a crear
   * @returns Obj creado
   */
  async createInfoData(info: any){
    return INFO_MODEL + info.modelo + INFO_UUID + info.uuid +
    INFO_VERSION + info.version + INFO_MANUFACTURE + info.fabricante +
  INFO_SYSTEM + info.os;
}

  /**
   * Send email
   *
   * @param to Destinatario
   * @param subject Mensaje a enviar
   */
  async sendMail(to: string, copy: Array<string>, subject: string){
    const link = MAIL_TO + to + CC_MAIL  + copy[0] + ', ' + copy[1] +  SUBJECT_MAIL + subject;
    this.iab.create(link,'_system').show();
  }

  /**
   * Control de tiempo max para
   * mantener una notification en
   * pantalla
   */
  async controlToNotifications(duration: number) {
    if (this.timeControl !== undefined) {
      clearTimeout(this.timeControl);
    }
    this.timeControl = setTimeout(() => {
      this.notification.cancelLoad();
    }, duration);
  }

  /**
   * Cancela el control de tiempo
   * excedido para notificaciones
   */
  async cancelControlNotifications(){
    if(this.timeControl !== undefined){
      clearTimeout(this.timeControl);
    }
  }

  /**
   * Metodo auxiliar para la creacion
   * de error ocurrido y posterior
   * storage
   *
   * @param ex Error ocurrido
   * @param screen Pantalla ocurrido error
   * @returns Objeto de error
   */
  async createError(error: string, phone: number, screen: string) {
    const uuid = this.accesstInfo.deviceInfo?.uuid;
    const model = this.accesstInfo.deviceInfo?.modelo;
    const version = this.accesstInfo.deviceInfo?.version;
    const fabricante = this.accesstInfo.deviceInfo?.fabricante;
    const er: Error = {
      phone,
      uuid,
      model,
      version,
      fabricante,
      screen,
      error,
      fecha: new Date().toISOString()
      };
    return er;
  }

  /**
   * Method auxiliar que valida el formato del dni
   *
   * @param dni Dni
   * @returns Comprobación dni/nie
   */
  validateDni(dni: string) {
    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    const nieRegex = /^[XxTtYyZz]{1}[0-9]{7}[a-zA-Z]{1}$/i;

    return (nifRegex.test(dni) || nieRegex.test(dni));
  }


  /**
   * Comprobacion de version instalada en el dispositivo
   *
   * @param tk Token employee
   */
    async checkingUpdate(tk: string){
    this.notification.loadingData(COLLECTING_INFO);
    this.controlToNotifications(MAX_TIME_LOADING);
      // Comprobacion de version actual instalada en dispositivo
    await this.checkSvc.checkingVersion(this.version, tk)
    .then(result => {
      const updateSubcription = result.subscribe(async (response: any) => {
        if(response.data === UPDATE_VALID){
          // Comprobacion de omision de actualizacion de la app
          await this.checkNotUpdate().then(async (count)=> {
            let auxSub = count.subscribe((res:any)=>{
              // Si no ha omitido la descarga de actualizacion mas de 3 veces
              if (res.data < 30) {
          // Si está conectado al wifi se permite realizar la descarga
            if(this.connection.typeConnection()){
              updateSubcription.unsubscribe();
                  this.downloadingUpdate(false);
              this.pendingUpdate = false;
            } else{
              // En caso contrario se solicita conectar con wifi para
              // realizar la descarga
              this.notification.notAllowUpdate();
              this.pendingUpdate = true;
                  this.checkNotUpdate(true).then((res)=>{
                    res.subscribe();
                  });
            }
              } else {
                this.downloadingUpdate(true);
                this.pendingUpdate = false;
              }
            auxSub.unsubscribe();
            });
          }).catch(ex=>{
            this.actionsCatch(ex);
          });
        } else {
          this.checkSvc.resetUpdateCount(this.storage.employee.username);
          this.actionsCatch();
          }
        });
    }).catch(ex => {
        this.actionsCatch(ex);
    });
  }

  /**
   * Muestra la alerta para la descarga y elige el camino
   * adecuado en caso de confirmación
   */
  async downloadingUpdate(forceUpdate: boolean){
    await this.notification.updateApp(forceUpdate).then(async res => {
      if(res.role === DOWNLOAD_VALID){
        this.procesingUpdate();
      } else{
        this.checkNotUpdate(true).then((res)=>{
          res.subscribe();
        });
        this.pendingUpdate = true;
      }
      this.notification.alertOp = false;
    });
  }

  /**
   * Muestra el toast de solicitud de desbloqueo en curso
   */
   async unlockRequested(isRequested: boolean){
    await this.notification.toastBaseInfo(REQUEST_IN_PROCESS.title, REQUEST_IN_PROCESS.msg, 'middle');
  }

  /**
   * Gestion de actualiacion segun plataforma
   */
  async procesingUpdate() {
    this.notification.updatingApp();
    try {
        if(this.platform.is(ANDROID_TYPE)){
          await this.checkSvc.getUpdateVersion(ANDROID_TYPE)
            .then(version => {
              version.subscribe((updateData: any) => {
                console.log(updateData);
                console.log(updateData.message);
                this.updateAndroidApp(updateData.message);
              });
            }).catch(ex => {
              alert(ex);
            });
        } else if(this.platform.is(IOS_TYPE)){
          await this.checkSvc.getUpdateVersion(IOS_TYPE)
            .then(version => {
              version.subscribe((updateData: any) => {
                this.updateIOSApp(updateData.message);
              });
          });
      } else{
        this.pendingUpdate = true;
        this.notification.alertOp = false;
      }
    } catch(ex) {
      this.notification.cancelLoad();
      this.notification.baseThrowAlerts(ERROR.title, UPDATE_ERROR.msg);
    }
  }

  /**
   * Comprobacion patron password
   *
   * @param pass Pass a comprobar
   * @returns Comprobacion
   */
  formatPass(pass: string) {
    const res = pass.match(PASS_FORMAT);
    return res !== null;
  }

    /**
     * Actualizacion automática version app
     */
  async updateAndroidApp(fileName: string) {
    this.base = this.checkSvc.base;
    if (!this.notification.loadData){
      this.controlToNotifications(NORMAL_TIME_WAIT);
      this.notification.loadingData(LOADING_CONTENT);
    }
    // Control extra para la descarga de actualizacion
    const controlUpdate = setTimeout(()=>{
      ApkUpdater.stop();
    }, UPDATE_MAX_TIME_LOADING);
    await ApkUpdater.download(this.base + BASE_UPDATE_LINK + fileName)
      .then(async res => {
        if (res !== undefined) {
          this.notification.cancelLoad();
          this.notification.loadingData(LOADING_CONTENT);
          // Si en este punto llega ok (sin tardar) se cancela control extra
          clearTimeout(controlUpdate);
          // Se realiza la instalación y continúa el flujo normal
          await ApkUpdater.install(async () => {
            }, (ex) => {
              this.notification.baseThrowAlerts(ERROR_DOWNLOAD_UPDATE, ex);
              this.createError(ex, this.storage.employee?.phone, 'UtilsService').then(result => {
                this.checkSvc.setErrors(result , UtilsService);
                });
            });
        }
      }).then(() => {
        this.notification.cancelLoad();
      }).catch((ex: any) => {
        this.pendingUpdate = true;
        this.notification.cancelLoad();
        if (!ex.stack.startsWith(ERROR_CANCEL_UPDATE)) {
          this.notification.baseThrowAlerts(UPDATE_ERROR.title, UPDATE_ERROR.msg);
        } else {
          this.notification.alertBaseNotifications(SERVER_NO_AVAILABLE.title, SERVER_NO_AVAILABLE.msg);
        }
      });
  }

  /**
   * Actualizacion para la plataforma IOS
   * 
   * NOTA: EL PARAM fileName NO SE UTILIZA HASTA VALIDAR
   * LA APP DE APPLE, ACTUALMENTE PWA
   */
  updateIOSApp(fileName: string) {
    const iosPath = BASE_URL + BASE_UPATE_IOS_PWA_LINK;
    this.iab.create(iosPath).show();
  }


  /**
   * Comprobacion de NO ACTUALIZACION
   * (Se permitira que el usuario no actualice un maximo
   * de 3 veces, si los supera se fuera la actualizacion).
   */
  async checkNotUpdate(isSum: boolean = false) {
    return await this.checkSvc.notUpdate(this.storage.employee.username, isSum)
      .then((count)=>{
        this.notification.cancelLoad();
        this.cancelControlNotifications();
        return count;
      });
  }
  /**
   * Comprobación de archivo environment pre/pro
   */
  async checkExistsFile() {
    if(this.platform.is(ANDROID_TYPE)){
      return this.file.checkFile(
        this.file.externalApplicationStorageDirectory + ANDROID_ENVIRONMENT_FILE_PATH,
        ENVIRONMENT_FILENAME)
      .then(() => true)
      .catch(() => false);
    } else{
      return await this.file.checkFile(
        this.file.applicationStorageDirectory,
        IOS_ENVIRONMENT_FILEDIR_PATH + '/' + ENVIRONMENT_FILENAME)
      .then(() => true)
      .catch(() => false);
    }
  }

  /**
   * Lectura archivo
   *
   * @returns Contenido archivo
   */
  async readFile(platform: string) {
    let path: string;
    if(platform === ANDROID_TYPE){
      path = this.file.externalApplicationStorageDirectory + ANDROID_ENVIRONMENT_FILE_PATH;
    } else if(platform === IOS_TYPE){
      path = this.file.applicationStorageDirectory + IOS_ENVIRONMENT_FILEDIR_PATH;
    }
    return await this.file.readAsText(path, ENVIRONMENT_FILENAME)
      .then(content => content);
  }

  /**
   * Crea un archivo txt con el contenido que recibe (SOLO PARA IOS)
   */
  async createFileIOS(url: string){
        await this.file.listDir(this.file.applicationStorageDirectory, IOS_ENVIRONMENT_FILEDIR_PATH)
        .then(collection => {
          collection[0].getParent((parent: DirectoryEntry) => {
            parent.getFile(ENVIRONMENT_FILENAME, {create: true, exclusive: false} , (data) => {
              if(data.isFile){
                data.createWriter(writter => {
                  const environmentData = new Blob([url], {type: 'text/plain'});
                  writter.write(environmentData);
                  return true;
                }, () => {
                  this.notification.baseThrowAlerts(ERROR_WRITE_FILE.title, ERROR_WRITE_FILE.msg);
                });
              }
            });
          });
        });
  }

  /**
   * Realiza el borrado del archivo environment.txt en las
   * distintas plataformas [ANDROID, IOS]
   */
  async deleteIOSFile() {
    try{
      this.checkExistsFile().then(result => {
        if (result) {
          if (this.platform.is(IOS_TYPE)) {
            this.file.removeFile(this.file.applicationStorageDirectory + IOS_ENVIRONMENT_FILEDIR_PATH, ENVIRONMENT_FILENAME)
            .then((res) => {
              if (res.success) {
                this.notification.alertBaseNotifications(CONFIRMATION_DELETE_IOS_FILE.title, CONFIRMATION_DELETE_IOS_FILE.msg);
              }
            });
          } else {
            this.file.removeFile(this.file.externalApplicationStorageDirectory + ANDROID_ENVIRONMENT_FILE_PATH, ENVIRONMENT_FILENAME)
            .then((res) => {
              if (res.success) {
                this.notification.alertBaseNotifications(CONFIRMATION_DELETE_IOS_FILE.title, CONFIRMATION_DELETE_IOS_FILE.msg);
              }
            });
          }
        } else {
          this.notification.alertBaseNotifications(FILE_NOT_EXISTS.title, FILE_NOT_EXISTS.msg);
        }
      });
    } catch(ex: any){
      this.notification.baseThrowAlerts(ERROR.title, ex);
    }
  }

  /**
  * App error Log
  * Registro de eventos sucedidos en la App
  *
  * @param message Representa informacion adicional
    * @param issue Representa la accion sucedida
    * @param screen Pantalla donde ha sucedido
  * 
  */
   async appActionLog(type: string, issue: string, message: string, screen?: string) {
    const logRequest = {
      type: type,
      action: issue,
      message: message,
      channel: 'app',
      screen: screen
    };
    this.checkSvc.logPost(logRequest);
  }

  async appErrorLog(type: string, issue: string, message: string, screen?: string) {
    const logRequest = {
      type: type,
      action: issue,
      message: message,
      channel: 'appError',
      screen: screen
    };
    this.checkSvc.logPost(logRequest);
  }

  /**
   * Metodo auxiliar para la gestion en caso de error con loading en curso (En catch)
   * @param ex 
   */
  async actionsCatch(ex: any = null){
    this.notification.cancelLoad();
    this.cancelControlNotifications();
    if (ex !== null) {
      this.notification.baseThrowAlerts(ERROR.title, ex);
    }
  }
}


