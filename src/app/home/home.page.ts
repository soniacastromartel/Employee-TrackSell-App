import { SESION_EXPIRED } from './../app.constants';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationsService } from '../services/notifications.service';
import { Platform, IonContent, ViewWillLeave, ViewWillEnter } from '@ionic/angular';
import { FaqComponent } from '../components/faq/faq.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DatacheckService } from '../services/datacheck.service';
import { EmployeeService } from '../services/employee.service';
import { UtilsService } from '../services/utils.service';
import {
  MAX_TIME_LOADING, DEV_WORD_CREATE_FILE_ENVIRONMENT, CONFIRMATION_CREATION_IOS_FILE, ERROR_CREATE_FILE,
  CABECERA_LOGIN, SCROLLING_TIME, POLICY_PRIVACY, SEND_CHANGE_REQUEST,
  CANCEL_OPTION, DNI, IMCOMPLETE_DATA, LOGO_WORD, PRIVACY_WORD,
  NOT_FOUND, LOADING_CONTENT, PASSWORD_CHANGED, ERROR_CHANGE_PASSWORD, RESPONSE_HACK, DENIED_ACTION,
  USERNAME, RESPONSE_INVALID_SECRET, RESPONSE_REQUESTED, INIT_SESION_REQUIRED,
  INCORRECT_SECRET_WORD, RESPONSE_LOGIN_SUCCESFULL, NAME, RESPONSE_OK_RESULT, ERROR, EMPTY_STRING, CONECTING,
  EMPLOYEE_NO_FOUND, INVALID_CREDENTIALS, EMPLOYEE_PENDING_VALIDATION, RESPONSE_NO_VALID, RESPONSE_INVALID_CREDENTIALS,
  RESPONSE_PENDING_VALIDATION, RESPONSE_PENDING_CHANGE_PASSWORD, DASHBOARD,
  PRE_REGISTER_LOST, RESPONSE_BLOCK_ACCOUNT, BLOCK_ACCOUNT, RESPONSE_REGISTERED, USER_EXIST_SYSTEM, REQUEST_ACCESS, ERROR_IN_LOGIN,
  ROUTE_CONTROL_ACCESS, VERSION_APP, MODE_ACTIVE, SUM_ACCESS, USER_VALIDADO, YA_VALIDADO, CORDOVA_PLATFORM, ANDROID_TYPE,
  IOS_TYPE, ONLY_IOS_ACTION, PERSON_ICON, CLOSE_ICON, NEW_REQUEST_ACCESS, LOG_TYPE, LOG_PLACE
} from '../app.constants';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements ViewWillEnter, ViewWillLeave {
  @ViewChild('content') content: IonContent;

  // ICOT Default Logo
  logo = CABECERA_LOGIN;

  // Control show/unshow pass
  showPass = false;

  // Icon show username field
  iconAux = '';

  // Form for users to access the app
  userForm = new FormGroup({
    user: new FormControl(undefined, [
      Validators.minLength(3),
      Validators.required,
    ]),
    pass: new FormControl(undefined, [
      Validators.minLength(6),
      Validators.required,
    ]),
  });

  // Var control seguimiento acceso employee
  routeAccessEmployee = -1;
  // Var control developerEnvironment environmet
  developerCount = 0;

  /**
   * Subcriptions de control
   */
  backButton: Subscription;
  loginSubcription: Subscription;

  constructor(
    private notification: NotificationsService,
    private checkSvc: DatacheckService,
    private employeSvc: EmployeeService,
    private platform: Platform,
    private route: Router,
    private utils: UtilsService) {
    this.backButton = this.platform.backButton.subscribe(() => {
      if (!this.notification.loadOp && !this.notification.exitPresent) {
        this.notification.exitApp().then((result) => {
          if (result) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            navigator['app'].exitApp();
          }
        }).catch((ex) => {
          this.notification.baseThrowAlerts(ERROR.title, ERROR.msg);
          this.utils.createError(ex, this.employeSvc.employee.phone, this.route.url).then(result => {
            this.checkSvc.setErrors(result, UtilsService);
          });
        });
      }
    });
  }

  /**
   * Se Recogen los centros disponibles
   * (Si no se han recogido)
   */
  async ionViewWillEnter() {
    this.iconAux = PERSON_ICON;
    this.acceptToPolicy();
    this.employeSvc.get(ROUTE_CONTROL_ACCESS).then(async result => { //digito (validated) de control de solicitud de acceso
      if (result === null) {//aun no ha intentado acceder nunca
        await this.getLocaleEmployeeDt().then(res => {
          if (res === undefined || (res.dni === null || res.name === null)) {
            this.routeAccessEmployee = -1;
          } else {
            this.routeAccessEmployee = 0;
          }
        });
      } else {
        this.employeSvc.get(USERNAME).then((nick) => {
          this.userForm.controls.user.setValue(nick);
        });
        this.routeAccessEmployee = result;
      }
      this.employeSvc.set(ROUTE_CONTROL_ACCESS, this.routeAccessEmployee);
    }).catch(ex => {
      const contactEmployee = this.employeSvc.employee !== undefined ? this.employeSvc.employee?.phone : null;
      this.utils.createError(ex, contactEmployee, this.route.url).then(result => {
        this.checkSvc.setErrors(result, UtilsService);
      });
    });

    this.platform.ready().then(() => {
      if (this.platform.is(CORDOVA_PLATFORM)) {
        let platformType;
        if (this.platform.is(ANDROID_TYPE)) {
          platformType = ANDROID_TYPE;
        } else if (this.platform.is(IOS_TYPE)) {
          platformType = IOS_TYPE;
        }
        this.utils.checkExistsFile().then(existsFile => {
          if (existsFile) {
            this.utils.readFile(platformType).then(contenido => {
              if (contenido !== undefined) {
                this.notification.alertBaseNotifications(MODE_ACTIVE.title, MODE_ACTIVE.msg + contenido);
                this.utils.actionLog(LOG_TYPE[1], MODE_ACTIVE.title, MODE_ACTIVE.msg + contenido);
                this.checkSvc.base = contenido;
              }
            });
          }
        });
      }
    });
    // Save version app
    await this.utils.getVersionApp();
  }

  /**
   * Comprobacion de aceptacion de la
   * politica de privacidad
   */
  acceptToPolicy() {
    this.employeSvc.get(PRIVACY_WORD).then(async (result) => {
      if (result == null) {
        await this.notification.showPrivacy(POLICY_PRIVACY)
          .then(resultado => {
            if (resultado) {
              // Save aceptacion policy privacy
              this.employeSvc.set(PRIVACY_WORD, true);
            } else {
              navigator['app'].exitApp();
            }
          });
      }
    }).catch(ex => {
      this.utils.createError(ex, this.employeSvc.employee?.phone, this.route.url).then(result => {
        this.checkSvc.setErrors(result, UtilsService);
      });
    });
  }

  /**
   * Comprobación de inicio o registro previo de usuario
   *
   * @returns employeeData
   */
  async getLocaleEmployeeDt() {
    let totalData: number;
    let employeeData: any;
    // Registros locales
    await this.employeSvc.count().then((count) => {
      totalData = count;
    });

    if (totalData > 1) {
      employeeData = {};
      await this.employeSvc.get(DNI).then((val) => {
        employeeData.dni = val;
      });
      await this.employeSvc.get(NAME).then((val) => {
        employeeData.name = val;
      });
      await this.employeSvc.get(USERNAME).then((value) => {
        employeeData.username = value;
      });
      return employeeData;
    }
  }

  // Check user data login
  async checkUser() {
    let version;

    if (this.loginSubcription !== undefined) {
      this.loginSubcription.unsubscribe();
    }

    if (this.utils.version === undefined) {
      await this.employeSvc.get(VERSION_APP).then(result => {
        version = result;
      });
    } else {
      version = this.utils.version;
    }

    const data = {
      username: this.userForm.controls.user.value.trim(),
      password: this.userForm.controls.pass.value,
      version: version
    };

    if (data.username !== undefined && data.username !== EMPTY_STRING) {
      this.utils.controlToNotifications(MAX_TIME_LOADING);
      this.notification.loadingData(CONECTING);
      await this.checkSvc.checkData(data)
        .then((result) => {
          this.loginSubcription = result.subscribe(
            (res: any) => {
              this.utils.actionLog(LOG_TYPE[0], res.message, res.data.user.username, LOG_PLACE[0]);
              this.actionResultLogin(res);
            }, async (svError) => {
              this.notification.cancelLoad();
              this.utils.cancelControlNotifications();
              if (svError.error.message === RESPONSE_PENDING_CHANGE_PASSWORD) {
                this.actionResultLogin({ message: RESPONSE_PENDING_CHANGE_PASSWORD });
                this.utils.actionLog(LOG_TYPE[0], svError.error.message, data.username + ' ' + data.password, LOG_PLACE[0]);
              } else {
                this.deniedChangePass(svError.error.message);
                this.utils.actionLog(LOG_TYPE[0], svError.error.message, data.username + ' ' + data.password, LOG_PLACE[0]);
                // Login incorrecto se suma el intento de acceso
                (await this.checkSvc.checkAccountAccess(data?.username, SUM_ACCESS)).subscribe();
              }
            }
          );
        }).catch((ex) => {
          this.notification.cancelLoad();
          this.utils.cancelControlNotifications();
          this.notification.baseThrowAlerts(ERROR_IN_LOGIN.title, ERROR_IN_LOGIN.msg);
          this.utils.createError(ex, this.employeSvc.employee.phone, this.route.url).then(result => {
            this.checkSvc.setErrors(result, UtilsService);
          });
        });
    }
  }

  /**
   * Resultado de login de usuario
   *
   * @param result Resultado a gestionar
   */
  async actionResultLogin(result: any) {
    this.notification.cancelLoad();
    const msg = result.message;
    if (result.success && result.data !== undefined &&
      result.data.access_token !== undefined && msg === RESPONSE_LOGIN_SUCCESFULL) {
      await this.employeSvc.setUser(result);
      this.route.navigate([DASHBOARD]);
      this.resetForm();
    } else {
      switch (msg) {
        case RESPONSE_NO_VALID:
          this.notification.alertBaseNotifications(EMPLOYEE_NO_FOUND.title, EMPLOYEE_NO_FOUND.msg);
          break; //empleado no encontrado
        case RESPONSE_PENDING_VALIDATION:
          this.notification.alertBaseNotifications(EMPLOYEE_PENDING_VALIDATION.title, EMPLOYEE_PENDING_VALIDATION.msg);
          break; // pendiente de validación
        case RESPONSE_PENDING_CHANGE_PASSWORD:
          this.changingUserPass(this.userForm.controls.user.value);
          break; //pendiente de cambiar la password
        case RESPONSE_BLOCK_ACCOUNT:
          this.notification.alertBaseNotifications(BLOCK_ACCOUNT.title, BLOCK_ACCOUNT.msg,);
          break; //cuenta bloqueada
      }
    }
  }

  // Remember user pass
  async recoveryPass() {
    this.resetForm();
    let employeeRegisterData;

    // Dispositivo
    await this.getLocaleEmployeeDt().then((employeeData) => {
      employeeRegisterData = employeeData;
    });
    await this.notification.rememberPass(employeeRegisterData)
      .then(async (result: any) => {
        if (result !== undefined) {
          if (result !== EMPTY_STRING) {
            // Inicio previo ok
            if (employeeRegisterData?.username != null) {
              this.utils.controlToNotifications(MAX_TIME_LOADING);
              this.notification.loadingData(CONECTING);
              await this.checkSvc.recoveryUserPass(result.toLowerCase(),
                employeeRegisterData !== undefined
                  ? employeeRegisterData
                  : null
              ).then((res) => {
                res.subscribe(async (r: any) => {
                  this.notification.cancelLoad();
                  this.utils.cancelControlNotifications();
                  switch (r.message) {
                    case RESPONSE_OK_RESULT:
                    case RESPONSE_PENDING_CHANGE_PASSWORD:
                      this.changingUserPass();
                      break;
                    case RESPONSE_REQUESTED:
                      this.deniedChangePass(RESPONSE_OK_RESULT);
                      this.utils.actionLog(LOG_TYPE[1], r.message, result, LOG_PLACE[1]);
                      break;
                    default:
                      this.deniedChangePass(r.message);
                      this.utils.actionLog(LOG_TYPE[1], r.message, result, LOG_PLACE[1]);
                      break;
                  }
                  // Operacion no realizada se suma el intento de acceso
                  (await this.checkSvc.checkAccountAccess(result, SUM_ACCESS)).subscribe();
                });
              });
            } else {
              // Inicio previo requerido
              this.deniedChangePass(RESPONSE_OK_RESULT);
            }
          } else {
            this.notification.alertBaseNotifications(IMCOMPLETE_DATA.title, IMCOMPLETE_DATA.msg);
          }
        }
      });
  }

  /**
   * Actualizacion de password automatica
   */

  async changingUserPass(userName?: string) {
    let user: any = {};
    if (this.employeSvc.employee === undefined) {
      await this.employeSvc.employeeBd.get(USERNAME).then((username_local) => {//employeSvc Storage Local
        if (username_local !== null && user.username !== null) {
          user.username = username_local;
        } else {
          user.username = userName;
        }
      });
      await this.notification.userChangePass(this.utils).then(async (res) => {     
        if (res.values.pass1 !== EMPTY_STRING) {
          user.pass = res.values.pass1;
        } else {
          user = undefined;
        }
        this.userForm.controls.pass.setValue('');
      });
      if (user !== undefined) {
        await this.checkSvc.userChangingPass({ username: user.username, password: user.pass }).then((result) => {
          this.utils.controlToNotifications(MAX_TIME_LOADING);
          this.notification.loadingData(LOADING_CONTENT);
          result.subscribe((itsOk: any) => {
            this.notification.cancelLoad();
            this.utils.cancelControlNotifications();
            if (itsOk.message === RESPONSE_OK_RESULT) {
              //  BIEN CONTRASEÑA CAMBIADA
              this.utils.actionLog(LOG_TYPE[0], itsOk.message, user.username + ' ' + user.pass, LOG_PLACE[1]);
              this.notification.alertBaseNotifications(PASSWORD_CHANGED.title, PASSWORD_CHANGED.msg);
            } else {
              // NO SE ACTUALIZÓ LA CONTRASEÑA
              this.notification.alertBaseNotifications(ERROR_CHANGE_PASSWORD.title, ERROR_CHANGE_PASSWORD.msg);
            }
          });
        });
      }
    }
  }

  /**
   * Método auxiliar que informa denegacion de cambio de contraseña y motivo.
   *
   * @param motive motivo de denegación
   */
  deniedChangePass(motive: string) {
    switch (motive) {
      case RESPONSE_OK_RESULT:
        // VALIDACIÓN OK PERO NO HAY DATOS PREVIOS
        this.notification.alertBaseNotifications(INIT_SESION_REQUIRED.title, INIT_SESION_REQUIRED.msg);
        break;
      case RESPONSE_NO_VALID:
        // CUENTA NO ENCONTRADA
        this.notification.alertBaseNotifications(NOT_FOUND.title, NOT_FOUND.msg);

        break;
      case RESPONSE_INVALID_CREDENTIALS:
        // CREDENCIALES INCORRECTOS
        this.notification.alertBaseNotifications(INVALID_CREDENTIALS.title, INVALID_CREDENTIALS.msg);
        break;
      case RESPONSE_PENDING_VALIDATION:
        // CUENTA PENDIENTE DE VALIDAR
        this.notification.alertBaseNotifications(EMPLOYEE_PENDING_VALIDATION.title, EMPLOYEE_PENDING_VALIDATION.msg);
        break;
      case RESPONSE_INVALID_SECRET:
        // POSIBLE ACCESO EXTERNO, O ERROR CON CLAVE SECRETA
        this.notification.alertBaseNotifications(INCORRECT_SECRET_WORD.title, INCORRECT_SECRET_WORD.msg);
        break;
      case RESPONSE_HACK:
        //DATOS QUE NO COINCIDEN
        this.notification.alertBaseNotifications(DENIED_ACTION.title, DENIED_ACTION.msg);
        break;
      case RESPONSE_BLOCK_ACCOUNT:
        //CUENTA BLOQUEADA POR INTENTOS DE ACCESO SUPERADOS
        this.notification.alertBaseNotifications(BLOCK_ACCOUNT.title, BLOCK_ACCOUNT.msg);

        break;
    }
  }

  /*
  * Solicitud de nuevo accesso
  */
  async newAccess() {
    this.resetForm();
    await this.getLocaleEmployeeDt().then(async (res) => {
      const preRegister = res;
      // Recogida de datos
      await this.notification.requestAccess().then(async (solicitud: any) => {
        if (solicitud !== undefined && solicitud.role !== CANCEL_OPTION) {
          const userDni = solicitud.data.dni.toUpperCase().trim();
          const userFullName = solicitud.data.name.toUpperCase().trim();
          if (userDni !== undefined && userDni !== EMPTY_STRING &&
            userFullName !== undefined && userFullName !== EMPTY_STRING && this.utils.validateDni(userDni)) {
            let infoDevice;
            try {
              infoDevice = await this.checkSvc.getUuid();
            } catch (ex) {
              infoDevice = undefined;
              this.utils.createError(ex, this.employeSvc.employee.phone, this.route.url).then(result => {
                this.checkSvc.setErrors(result, UtilsService);
              });
              this.notification.baseThrowAlerts(ERROR.title, ex);
            }

            const data: string = await this.utils.createInfoData(infoDevice);
            // No hay datos guardados previamente
            if (preRegister === undefined ||
              (preRegister !== undefined && preRegister.dni === null && preRegister.name === null)) {
              this.goRequestAccess(userDni, userFullName, data);
              this.utils.actionLog(LOG_TYPE[0], REQUEST_ACCESS.title, userDni + ' ' + userFullName, LOG_PLACE[2])
              // Solicitud enviada, no ha iniciado sesión
            } else if (this.routeAccessEmployee === 0) {
              // Datos guardados previamente pero no son iguales
              if (preRegister.dni !== userDni || preRegister.name !== userFullName) {
                await this.notification.alertBaseQuestions(
                  NEW_REQUEST_ACCESS.title,
                  NEW_REQUEST_ACCESS.msg)
                  .then(responseUser => {
                    if (responseUser) {
                      this.goRequestAccess(userDni, userFullName, data);
                      this.utils.actionLog(LOG_TYPE[0], NEW_REQUEST_ACCESS.title, userDni + ' ' + userFullName, LOG_PLACE[2])
                    }
                  });
              } else {
                // Datos guardados previamente pero son iguales
                this.notification.alertBaseNotifications(REQUEST_ACCESS.title, REQUEST_ACCESS.msg);
                this.utils.actionLog(LOG_TYPE[0], REQUEST_ACCESS.title, userDni + ' ' + userFullName, LOG_PLACE[2])
              }
              // Solicitud enviada y procesada. Ya inicio sesión
            } else if (this.routeAccessEmployee === 1) {
              this.notification.alertBaseNotifications(PRE_REGISTER_LOST.title, PRE_REGISTER_LOST.msg);
              this.utils.actionLog(LOG_TYPE[0], PRE_REGISTER_LOST.title, userDni + ' ' + userFullName, LOG_PLACE[2])
            }
          } else {
            // Operacion no realizada
            this.notification.cancelLoad();
            this.utils.cancelControlNotifications();
            this.notification.alertBaseNotifications(IMCOMPLETE_DATA.title, IMCOMPLETE_DATA.msg);
            this.utils.actionLog(LOG_TYPE[1], IMCOMPLETE_DATA.msg, userDni + ' ' + userFullName, LOG_PLACE[2])
          }
        }
      }).catch((ex) => {
        this.notification.baseThrowAlerts(ERROR.title, ex);
        this.utils.createError(ex, this.employeSvc.employee?.phone, this.route.url).then(result => {
          this.checkSvc.setErrors(result, UtilsService);
        });
      });
    });
  }

  /**
   * Resultado operacion solicitud de acceso 
   */
  responseAccess(result: any, dni: string, fullName: string) {
    switch (result.message) {
      case RESPONSE_OK_RESULT:
      case RESPONSE_REQUESTED:
        //SOLICITUD ENVIADA CORRECTAMENTE
        this.notification.alertBaseNotifications(SEND_CHANGE_REQUEST.title, SEND_CHANGE_REQUEST.msg);
        break;
      case RESPONSE_REGISTERED:
        //EL USUARIO EXISTE, INICIE SESIÓN
        this.notification.alertBaseNotifications(USER_EXIST_SYSTEM.title, USER_EXIST_SYSTEM.msg);
        break;
      case RESPONSE_BLOCK_ACCOUNT:
        //CUENTA BLOQUEADA
        this.notification.alertBaseNotifications(BLOCK_ACCOUNT.title, BLOCK_ACCOUNT.msg);
        break;
    }
    if (result.message === RESPONSE_OK_RESULT || result.message === RESPONSE_REQUESTED) {
      if (result.data !== undefined) {
        const usernameEmployee = result.data.user;
        this.employeSvc.set(USERNAME, usernameEmployee);
      }
      // Se guardan los datos en el dispositivo [NOMBRE, DNI, USERNAME]
      this.employeSvc.set(NAME, fullName);
      this.employeSvc.set(DNI,dni);
      this.routeAccessEmployee = 0;
      this.employeSvc.set(ROUTE_CONTROL_ACCESS, this.routeAccessEmployee);
    }
  }


  // Clear form
  resetForm() {
    this.userForm.controls.user.setValue(EMPTY_STRING);
    this.userForm.controls.pass.setValue(EMPTY_STRING);
  }

  // Open FAQ Modal Component
  openFAQ() {
    this.notification.pageSvc.openFAQ(FaqComponent, false);
    this.userForm.controls.pass.setValue(EMPTY_STRING);
  }

  // Scroll when focus in input
  logScroll() {
    const logoY = document.getElementById(LOGO_WORD).offsetHeight;
    this.content.scrollByPoint(0, logoY, SCROLLING_TIME);
  }

  clearUserName() {
    this.userForm.controls.user.setValue(undefined);
    this.iconAux = PERSON_ICON;
  }

  showDeleteField() {
    if (this.userForm.controls.user.value) {
      this.iconAux = CLOSE_ICON;
    } else {
      this.iconAux = PERSON_ICON;
    }
  }

  /**
   * Cambia la var de control para mostrar/ocultar
   * la pass introducida
   */
  showUnshowPass() {
    this.showPass = !this.showPass;
  }


  /**
   * Method to enable the 'developer mode' by using 'dev' as username and pressing the company logo up to ten
   * times.
   * 
   */

  async developerEnvironment() {
    if (this.developerCount < 10) {
      this.developerCount++;
    } else {
      if (this.userForm.controls.user.value === DEV_WORD_CREATE_FILE_ENVIRONMENT) {
        await this.notification.contentFileEnvironment().then(res => {
          switch (res.role) {
            case 'accept':
              if (res.data.values[0] !== undefined && res.data.values[0] !== EMPTY_STRING) {
                if (this.platform.is(IOS_TYPE)) {
                  this.utils.createFileIOS(res.data.values[0])
                    .then(() => {
                      this.notification.alertBaseNotifications(CONFIRMATION_CREATION_IOS_FILE.title, CONFIRMATION_CREATION_IOS_FILE.msg)
                        .catch(ex => {
                          this.notification.baseThrowAlerts(ERROR_CREATE_FILE.title, ERROR_CREATE_FILE.msg);
                        });
                    });
                } else {
                  this.notification.alertBaseNotifications(ONLY_IOS_ACTION.title, ONLY_IOS_ACTION.msg);
                }
              } else {
                this.notification.alertBaseNotifications(IMCOMPLETE_DATA.title, IMCOMPLETE_DATA.msg);
              }
              break;
            case 'delete':
              this.utils.deleteIOSFile();
              break;
            default:
              break;
          }
        });
      }
    }
  }

  // Remove subcripción backButton dispositivo
  ionViewWillLeave() {
    if (this.backButton !== undefined) {
      this.backButton.unsubscribe();
    }

    if (this.loginSubcription !== undefined) {
      this.loginSubcription.unsubscribe();
    }
    this.platform.pause.subscribe(()=>{
      this.employeSvc.employeeListener.next(undefined);
      this.notification.alertBaseNotifications(SESION_EXPIRED.title, SESION_EXPIRED.msg);
    });
  }

  /**
   * Metodo auxiliar privado que realiza la solicitud tras previa
   * validacion de datos introducidos.
   * 
   */
  private async goRequestAccess(userDni: string, uFullName: string, data: any) {
    this.utils.controlToNotifications(MAX_TIME_LOADING);
    this.notification.loadingData(LOADING_CONTENT);
    (await this.checkSvc.newEmployeeAccess(
      { dni: userDni, name: uFullName, infoDevice: data }
    ))
      .subscribe((result: any) => {
        this.notification.cancelLoad();
        this.utils.cancelControlNotifications();
        this.responseAccess(result, userDni, uFullName);
      }, err => {
        if (err.error.message === USER_VALIDADO) {
          this.notification.cancelLoad();
          this.utils.cancelControlNotifications();
          this.notification.alertBaseNotifications(YA_VALIDADO.title, YA_VALIDADO.msg);
        }
      });
  }
}
