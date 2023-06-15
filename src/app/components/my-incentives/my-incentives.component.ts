/* eslint-disable radix */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import {
  RESUMEN_INCENTIVOS, SPANISH_MONTHS_VALUES, LABELS_FOR_SELECT_INCENTIVES, CONTENT_LABELS,
  CENTRE_NO_ACTIVE
} from './../../app.constants';
import { AfterContentInit, Component } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import {
  LOADING_CONTENT, YEAR_FORMAT, EURO_DIGIT, MAX_TIME_LOADING, CORTE_FROM, CORTE_TO, ERROR, INFO_CENTER_NO_ACTIVE,
  CANCEL_OPTION
} from '../../app.constants';
import { DatacheckService } from '../../services/datacheck.service'; //llamadas http
import { StorageService } from '../../services/storage.service';
import * as moment from 'moment';
import { UtilsService } from '../../services/utils.service';
import { ViewWillEnter } from '@ionic/angular';
import { SliceLargeTextPipe } from '../../pipes/slice-large-text.pipe';
import { NewSaleComponent } from '../new-sale/new-sale.component';
import { Subscription } from 'rxjs';
import { ServiceEmployee } from '../../models/service_employee';

@Component({
  selector: 'app-my-incentives',
  templateUrl: './my-incentives.component.html',
  styleUrls: ['./my-incentives.component.scss'],
  providers: [SliceLargeTextPipe]
})
export class MyIncentivesComponent implements ViewWillEnter, AfterContentInit {
  // Meses spanish
  monthsValues = SPANISH_MONTHS_VALUES;
  // Type for search IPrevent State change when switching between segments ionicncentives
  labelsForSelect = LABELS_FOR_SELECT_INCENTIVES;
  // Label info screen
  contentLabel = CONTENT_LABELS;
  // Content header table incentives
  tableDetailsLabels = [{ label: 'SERVICIO', size: 6 }, { label: 'INCENTIVO', size: 3 }, { label: 'ESTADO', size: 3 }];

  // Contenido (Resumen) a mostrar
  contentData = [];
  // Servicios gesionados (incentivados)
  services: Array<ServiceEmployee>;
  // Fecha actual
  actualDate: Date;

  // Control to actions
  dateSearch: string;
  fechaIncentivos: string;
  isResume: boolean;
  moreInfoHelp: boolean;
  loadingData = this.notification.loadData;

  slideOpts = {
    initialSlide: 0
  };

  eventName;

  // Subcription de control
  subcriptionData: Subscription;

  constructor(private notification: NotificationsService,
    private checkSvc: DatacheckService,
    private storage: StorageService,
    private utils: UtilsService,
    public pipeLargeTxt: SliceLargeTextPipe
  ) { }

  /**
   * Init Data Configuration
   */
  ionViewWillEnter() {
    this.isResume = true;
    this.dateSearch = this.labelsForSelect[0];
    this.actualDate = new Date();
    this.filterFor();

  }

  ngAfterContentInit() {
    this.fechaIncentivos = null;
  }

  /**
   * Seccion a mostrar, [RESUMEN o DETALLE]
   *
   * @param page Nombre de la seccion a mostrar
   */
  showDataFor(page: string) {
    this.isResume = page === RESUMEN_INCENTIVOS;
    if (!this.isResume && this.services !== undefined
      && this.services.length > 0 && !this.moreInfoHelp) {
      this.notification.showAlertMoreInfo();
      this.moreInfoHelp = true;
    }
  }

  /**
   * Opciones para consultar incentivos
   */
  async filterFor() {
    setTimeout(() => {
      this.contentData = [];
      this.services = [];
      this.fechaIncentivos = null;
      this.notification.loadingData(LOADING_CONTENT);
      switch (this.dateSearch) {
        case this.labelsForSelect[0]:
          this.searchingIncentivesEmployee();
          break;
        case this.labelsForSelect[1]:
          this.fechaIncentivos = new Date().toISOString();
          this.filterForDate(moment(this.fechaIncentivos).format(YEAR_FORMAT), 1);
          break;
        case this.labelsForSelect[2]:
          this.fechaIncentivos = new Date().toISOString();
          this.filterForDate(
            (moment(this.fechaIncentivos).month() + 1) + '-' +
            moment(this.fechaIncentivos).format(YEAR_FORMAT), 2);
          break;
      }
    }, 0);
  }

  /**
   * Filtro de incentivos por fechas
   * Se puede filtrar por año o por mes y año
   *
   * @param date Fecha seleccionada
   * @param mode Tipo de filtro [1: FILTRO AÑO, 2: FILTRO MES Y AÑO]
   */
  filterForDate(date: string, mode: number) {
    this.services = [];
    if (mode === 1) {
      this.searchingIncentivesEmployee(undefined, Number.parseInt(date, 0));
    } else {
      const collectionDate = date.split('-');
      this.searchingIncentivesEmployee(
        Number.parseInt(collectionDate[0], 0),
        Number.parseInt(collectionDate[1], 0));
    }
  }

  /**
   * Filtro para consultar incentivos, según los parámetros que recibe:
   *
   * @param month Mes a consultar, si es undefined se omite.
   * @param year Año a consultar, si es undefined se omite.
   */
  async searchingIncentivesEmployee(month?: number, year?: number) {
    console.log(this.storage.user);
    this.notification.loadData = true;
    if (this.subcriptionData !== undefined) {
      this.subcriptionData.unsubscribe();
    }

    this.utils.controlToNotifications(MAX_TIME_LOADING);
    if (month === undefined && year === undefined) {
      // MES ACTUAL
      const day = this.actualDate.getDate();
      if (day > 20) {
        month = this.actualDate.getMonth() + 2;
      } else {
        month = this.actualDate.getMonth() + 1;
      }
    }

    await this.checkSvc.getIncentivesForEmployee(this.storage.employee.username, this.storage.actualToken, month, year)
      .then(result => {
        this.subcriptionData = result.subscribe((incentives: any) => {
          if (incentives.data) {
            const data = incentives.data;
            this.contentData.push(data.cont_sales, data.total_incentives + EURO_DIGIT);
            data.sales.forEach((element: any) => {
              this.services.push(element);
            });
          }
          this.notification.loadData = false;
          this.notification.cancelLoad();
          this.utils.cancelControlNotifications();
        });
      }).catch(ex => {
        if (!ex.error.success && ex.error.message === CENTRE_NO_ACTIVE) {
          this.notification.alertBaseNotifications(INFO_CENTER_NO_ACTIVE.title, INFO_CENTER_NO_ACTIVE.msg);
        } else {
          this.notification.baseThrowAlerts(ERROR.title, ERROR.msg);
        }
      });
  }

/**
 * Refresca la busqueda de incentivos
 * según la selección del usuario
 */
  updateSelection(event: any) {
  //si hay datos en contentData y el datetime no se ha tocado, se sale y los datos quedan estáticos. No hay actualización en el componente
  if (this.contentData && this.contentData.length != 0 && event.target.className.split(' ')[0]=='ng-untouched'){
    return;
  } 

  if (!this.notification.loadOp) {
    this.notification.loadingData(LOADING_CONTENT);
    this.contentData = [];
    this.services = [];
    if (this.dateSearch === this.labelsForSelect[1]) {
      this.searchingIncentivesEmployee(undefined, Number.parseInt(this.fechaIncentivos.substr(0, 4)));
    } else if (this.labelsForSelect[2]) {
      const monthNumber = Number.parseInt(this.fechaIncentivos.split('-')[1]);
      this.searchingIncentivesEmployee(monthNumber, Number.parseInt(this.fechaIncentivos.substr(0, 4)));
    }
  }
}

/**
 * Muestra más información del servicio
 * seleccionado
 */
async moreInfo(service: ServiceEmployee){
  await this.notification.infoEmployeeService(service).then(data => {
    if(data !== CANCEL_OPTION){
      this.newSale(service);
    }
  });
}


  /**
   * Toast informativo de la fecha de corte actual
   */
  infoCorte() {
    let previousMonth; let nextMonth;
    const month = this.actualDate.getMonth();
    const day = this.actualDate.getDate();

    if (month === 0) {
      if (day < 21) {
        previousMonth = 11;
        nextMonth = 0;
      } else {
        previousMonth = 0;
        nextMonth = month + 1;
      }
    } else if (month === 11) {
      if (day < 21) {
        previousMonth = month - 1;
        nextMonth = month;
      } else {
        previousMonth = month;
        nextMonth = 0;
      }
    } else {
      if (day < 21) {
        previousMonth = month - 1;
        nextMonth = month;
      } else {
        previousMonth = month;
        nextMonth = month + 1;
      }
    }
    this.notification.toastBaseInfo('CORTE ACTUAL',CORTE_FROM + SPANISH_MONTHS_VALUES[previousMonth] + CORTE_TO + SPANISH_MONTHS_VALUES[nextMonth], 'top');
  }

  /**
   * Apertura formulario venta
   */
  newSale(service = null) {
    this.goBack();
    if (service === null) {
      this.notification.pageSvc.recomendedService(NewSaleComponent, undefined, undefined, service, false);
    } else {
      this.notification.pageSvc.recomendedService(NewSaleComponent, undefined, undefined, service, true);
    }
  }

  /* CLOSE SECTION INCENTIVES */
  goBack() {
    this.notification.closeModal();
  }
}
