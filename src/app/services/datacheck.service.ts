/* eslint-disable object-shorthand */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  SERVICES_OF_CENTER, SELLING_SERVICES, RANKINGS_OF_EMPLOYEES,
  NEW_ACCESS, ERROR_APP, ACCESS_COUNT, LOGIN_APP,
  USER_RECOVERY_PASS, SECRET, CHANGING_PASS, CENTER_EMPLOYEE,
  CATEGORIES_LIST, CENTERS_LIST, INCENTIVES_EMPLOYEE, GET_VERSION, CHECKING_VERSION, DATA_PROMO, QUESTIONS_FAQ,
  LAST_CHANGES, CLASIFICATION_LEAGUE, BASE_URL, SEARCH_TRACKING, AVAILABLES_DISCOUNTS, APP_LOGS, CHECK_NOT_UPDATE,
  RESET_COUNT_UPDATE, LOG_TYPE
} from '../app.constants';
import { AccessToService } from './access-to.service';
import { map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatacheckService {

  public base: string;
  private login: string;
  private newAccess: string;
  private changingPass: string;
  private recoveryPass: string;
  private getCategories: string;
  private getCenterOfEmployee: string;
  private getAllCenters: string;
  private incentives: string;
  private searchTracking: string;
  private servicesOfCenter: string;
  private sellingService: string;
  private getRankings: string;
  private clasificationLeague: string;
  private saveErrors: string;
  private accessCount: string;
  private checkVersion: string;
  private getVersion: string;
  private verifyUpdate: string;
  private resetCountUp: string;
  private promotions: string;
  private faqQuestions: string;
  private lastChanges: string;
  private getDiscounts: string;
  private options: any;
  private logsApp: string;

  constructor(private http: HttpClient,
    private accesing: AccessToService) {
    this.base = BASE_URL;
    this.login = LOGIN_APP;
    this.newAccess = NEW_ACCESS;
    this.changingPass = CHANGING_PASS;
    this.recoveryPass = USER_RECOVERY_PASS;
    this.getCenterOfEmployee = CENTER_EMPLOYEE;
    this.getAllCenters = CENTERS_LIST;
    this.getCategories = CATEGORIES_LIST;
    this.incentives = INCENTIVES_EMPLOYEE;
    this.searchTracking = SEARCH_TRACKING;
    this.servicesOfCenter = SERVICES_OF_CENTER;
    this.sellingService = SELLING_SERVICES;
    this.getRankings = RANKINGS_OF_EMPLOYEES;
    this.clasificationLeague = CLASIFICATION_LEAGUE;
    this.saveErrors = ERROR_APP;
    this.accessCount = ACCESS_COUNT;
    this.checkVersion = CHECKING_VERSION;
    this.getVersion = GET_VERSION;
    this.verifyUpdate = CHECK_NOT_UPDATE;
    this.resetCountUp = RESET_COUNT_UPDATE;
    this.promotions = DATA_PROMO;
    this.faqQuestions = QUESTIONS_FAQ;
    this.lastChanges = LAST_CHANGES;
    this.getDiscounts = AVAILABLES_DISCOUNTS;
    this.logsApp = APP_LOGS;

    this.options = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      }
    };
  }

  /**
   * Comprobacion version app
   *
   * @param version Version actual instalada en dispositivo
   * @returns Nueva version estable disponible o no
   */
  async checkingVersion(version: string, tk: string) {
    return this.http.get(this.base + this.checkVersion + '?version=' + version, this.setHeader(tk));
  }

  /**
   * Busca la version adecuada para actualizar
   *
   * @param platform Plataforma actual
   * @returns Archivo a installar
   */
  async getUpdateVersion(platform: string) {
    // Por defecto el type es l (link), dato que se recoge
    return this.http.get(this.base + this.getVersion + '?platform=' + platform + '&type=l', this.options);
  }

  /**
   * Get change list update
   *
   * @param version Version actual
   *
   * @returns Lista de cambios
   */
  async getLastChangesUpdate(version: any) {
    return this.http.post(this.base + this.lastChanges, version, this.options);
  }

  /**
   * Gestion y comprobacion del conteo de omision de actualizacion
   * @param username Usuario actual
   * @param isSumCount Accion de suma
   * @param reset Reseteo de contador
   * @returns Respuesta consulta
   */
  async notUpdate(username: string, isSumCount: boolean, reset: boolean = false) {
    return this.http.post(this.base + this.verifyUpdate, { data: username, isSum: isSumCount, reset: reset }, this.options);
  }

  /**
   * Resetea el contador para el control de actualizacion (Intentos permitidos 3).
   * @param Nombre_de_usuario al que se resetea el contador
   */
  async resetUpdateCount(username: string) {
    this.http.post(this.base + this.resetCountUp, { user: username }, this.options).subscribe();
  }

  /**
   * Comprobación y control de accesos
   *
   * @param username Identificacion user
   * @param mode Tipo '?' Consulta, '1' Suma de accesos
   * @returns Count access
   */
  async checkAccountAccess(username: string, mode: string) {
    return this.http.get(this.base + this.accessCount + '?username=' + username + '&type=' + mode, this.options)
      .pipe(map((result: any) => {
        if (result !== null) {
          return result.data;
        }
      }));
  }

  /**
   * Recoge los descuentos disponibles
   */
  async getAvailablesDiscounts(service: number, centre: number) {
    return this.http.get(this.base + this.getDiscounts + service + '/' + centre, this.options);
  }

  /**
   * Crea la cabecera de la consulta (Reutilizable)
   *
   * @param tk Token de acceso de empleado
   * @returns Cabecera generada
   */
  setHeader(tk: string) {
    return {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + tk
      })
    };
  }

  /**
   * Opciones de preguntas y respuestas para el FAQ
   *
   * @returns Data FAQ
   */
  async getOptionsFAQ() {
    return this.http.get(this.base + this.faqQuestions, this.options);
  }

  /**
   * Login de usuario
   *
   * @param user Empleado que accede
   */
  async checkData(user: any) {
    return this.http.post(this.base + this.login, user, this.options);
  }

  /**
   * Solicitud de nuevo acceso para usuario
   *
   * @param info User data
   * @returns result operation
   */
  async newEmployeeAccess(info: any) {
    return this.http.post(this.base + this.newAccess, info, this.options);
  }

  /**
   * Realiza solicitud de restauración de contraseña
   *
   * @param userData
   * @returns Result query request
   */
  async recoveryUserPass(inputData: string, localData: any) {
    if (localData != null) {
      localData.username = inputData;
      localData.secret = SECRET;
      return this.http.post(this.base + this.recoveryPass, localData, this.options);
    } else {
      //NO HAY REGISTROS Y TAMPOCO INICIO DE SESIÓN PREVIA.
      const failData = new EventEmitter(false);
      return failData;
    }
  }

  /**
   * Actualización automática de la contraseña por parte del usuario.
   * Se necesita un registro previo o inicio de sesión al menos una
   * vez para conocer al usuario.
   *
   * @param dataPass Datos usuario
   * @returns Consulta
   */
  async userChangingPass(dataPass: any) {
    return this.http.post(this.base + this.changingPass, dataPass, this.options);
  }

  /**
   * @returns Lista de centros
   */
  async getCenters() {
    return this.http.get(this.base + this.getAllCenters);
  }

  /**
   * @returns Lista de categorías disponibles
   */
  async getJobCategory() {
    return this.http.get(this.base + this.getCategories);
  }

  /**
   * RECOGER LOS DATOS DEL CENTRO DEL EMPLEADO
   *
   * @param username Empleado del centro a buscar
   */
  async getEmployeeCenter(username: string, tk: string) {
    return this.http.get(this.base + this.getCenterOfEmployee + username, this.setHeader(tk));
  }

  /**
   * Recoge la lista de incentivos para un mes en concreto,
   * un año en concreto o el mes y el año solicitado.
   *
   * @param username Empleado a consultar incentivos
   * @param tk Token de acceso
   * @param m Mes a consultar (Undefined si no se requiere)
   * @param y Año a consultar (Undefined si no se requiere)
   * @returns JSON con la información solicitada
   */
  async getIncentivesForEmployee(username: string, tk: string, m?: number, y?: number) {
    if (m === undefined) {
      return this.http.post(this.base + this.incentives, { username: username, year: y }, this.setHeader(tk));
    } else {
      return this.http.post(this.base + this.incentives, { username: username, month: m, year: y }, this.setHeader(tk));
    }
  }

  /**
   * Recoge la informacion de un tracking pasado (repeticion)
   *
   * @param idTracking Tracking id
   * @param tk Token empleado
   * @returns Lista de datos relacionado con el tracking que se busca
   */
  async getDataTracking(idTracking: number, tk: string) {
    return this.http.get(this.base + this.searchTracking + '?id=' + idTracking, this.setHeader(tk));
  }

  /**
   * Recoger servicios por centro
   *
   * @param centerId Id centro
   * @param tk Token empleado
   * @returns Lista de servicios disponible para el centro
   */
  async getServicesOf(centerId: number, orderDiff: boolean, tk: string) {
    return this.http.get(this.base + this.servicesOfCenter + centerId + '/' + orderDiff, this.setHeader(tk));
  }

  /**
   * Venta de servicio por parte de empleado
   *
   * @param venta Venta a realizar
   * @param tk Token empleado
   * @returns Result operation
   */
  async saleForEmployee(venta: any, tk: string) {
    return this.http.post(this.base + this.sellingService, venta, this.setHeader(tk));
  }

  /**
   * Lista de ranking de empleados
   *
   * @param centreName Nombre del centro de empleado
   * @param tk Token de empleado
   * @returns Listado de ranking
   */
  async getRankingsOf(centreId: number, tk: string, month?: number, year?: number) {
    if (centreId !== undefined) {
      // CONSULTA PARA MI CENTRO
      return this.http.post(this.base + this.getRankings, { centre_id: centreId, month: month, year: year }, this.setHeader(tk));
    } else {
      // CONSULTA PRA GRUPO
      return this.http.post(this.base + this.getRankings, { month: month, year: year }, this.setHeader(tk));
    }
  }

  /**
   * Recoge la clasificacion de liga de los centros
   *
   * @param centreId Centro solicitado de consulta
   * @param month Mes de consulta
   * @param year Año de consulta
   * @param tk Token de autenticacion
   * @returns Liga de centros
   */
  async getClasificationLeague(centreId, month, year: number, tk: string) {
    return this.http.post(
      this.base + this.clasificationLeague,
      { centre: centreId, month: month, year: year, type: 'data' },
      this.setHeader(tk));
  }

  /**
   * Storage error in app
   *
   * @param error a guardar
   * @returns Resultado operación
   */
  async setErrors(error: any, extraCompo: any) {
    extraCompo.actionLog(LOG_TYPE[2], error.screen, error.error);
    return this.http.post(this.base + this.saveErrors, error, this.options)
      .subscribe(res => {
        console.log(res);
      });
  }

  /**
   * Get info dispositivo
   *
   * @returns Info device
   */
  async getUuid() {
    return this.accesing.getUuid();
  }

  /**
   * Recoge las promociones actuales que se cargaran
   * en el banner inferior de la pagina principal
   *
   * @returns Lista de promotions
   */
  async getPromotionsForApp(tk: string) {
    return this.http.get(this.base + this.promotions, this.setHeader(tk));
  }

  async logPost(logRequest: any) {
    return this.http.post(this.base + this.logsApp, logRequest, this.options).subscribe();
  }
}
