import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

import { NotificationsService } from 'src/app/services/notifications.service';
import { NewSaleComponent } from 'src/app/components/new-sale/new-sale.component';
import { LOADING_CONTENT, MAX_TIME_LOADING, EURO_DIGIT, CENTRE_NO_ACTIVE, INFO_CENTER_NO_ACTIVE, ERROR, YEAR_FORMAT, CONTENT_LABELS, LABELS_FOR_SELECT_INCENTIVES, SPANISH_MONTHS_VALUES, CANCEL_OPTION } from 'src/app/app.constants';
import { UtilsService } from 'src/app/services/utils.service';
import { ServiceEmployee } from 'src/app/models/service_employee';

import * as moment from 'moment';
import { StorageService } from 'src/app/services/storage.service';
import { DatacheckService } from 'src/app/services/datacheck.service';
import { Subscription } from 'rxjs';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.page.html',
  styleUrls: ['./incentives.page.scss'],
})
export class IncentivesPage implements OnInit {
  @ViewChild('content') content: IonContent;

  dateSearch: string = 'MENSUAL'; // Set the initial segment
  // Meses spanish
  monthsValues = SPANISH_MONTHS_VALUES;
  // Label info screen
  contentLabel = CONTENT_LABELS;
  // Content header table incentives
  tableDetailsLabels = [{ label: 'SERVICIO', size: 6 }, { label: 'INCENTIVO', size: 3 }, { label: 'ESTADO', size: 3 }];

  contentData = [];
  services: Array<ServiceEmployee>;
  actualDate: Date;
  // Control to actions
  fechaIncentivos: string;
  isResume: boolean;
  moreInfoHelp: boolean;
  loadingData = this.notification.loadData;

  // Subcription de control
  subcriptionData: Subscription;

  constructor(
    private location: Location,
    private notification: NotificationsService,
    private utils: UtilsService,
    private storage: StorageService,
    private checkSvc: DatacheckService

  ) {

  }

  ngOnInit() {
    this.actualDate = new Date();
    this.filterFor();
  }

  ngAfterContentInit() {
    this.fechaIncentivos = null;
  }

  ionViewWillEnter() {
  }

  goBack() {
    this.location.back();
  }

  /**
   * Apertura formulario venta
   */
  newSale(service = null) {
    if (service === null) {
      this.notification.pageSvc.recomendedService(NewSaleComponent, undefined, undefined, service, false);
    } else {
      this.notification.pageSvc.recomendedService(NewSaleComponent, undefined, undefined, service, true);
    }
  }

  /**
  * Opciones para consultar incentivos
  */
  async filterFor() {
    console.log(this.dateSearch);
    setTimeout(() => {
      this.contentData = [];
      this.services = [];
      this.fechaIncentivos = null;
      switch (this.dateSearch) {
        case 'ANUAL':
          this.fechaIncentivos = new Date().toISOString();
          this.filterForDate(moment(this.fechaIncentivos).format(YEAR_FORMAT), 1);
          break;
        case 'MENSUAL':
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
    console.log(date);
    console.log(mode);
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
 * Refresca la busqueda de incentivos
 * según la selección del usuario
 */
  updateSelection(event: any, dateSearch: string) {
    // console.log(this.contentData);
    console.log(this.fechaIncentivos);
    console.log(this.dateSearch);
    //si hay datos en contentData y el datetime no se ha tocado, se sale y los datos quedan estáticos. No hay actualización en el componente
    if (event.target.className.split(' ')[0] == 'ng-untouched') {
      return;
    }
    if (!this.notification.loadOp) {
      this.contentData = [];
      this.services = [];
      const monthNumber = Number.parseInt(this.fechaIncentivos.split('-')[1]);
      if (this.dateSearch == 'ANUAL') {
        this.searchingIncentivesEmployee(undefined, Number.parseInt(this.fechaIncentivos.substr(0, 4)));
      } else {
        this.searchingIncentivesEmployee(monthNumber, Number.parseInt(this.fechaIncentivos.substr(0, 4)));

      }

    }
  }

  /**
   * Filtro para consultar incentivos, según los parámetros que recibe:
   *
   * @param month Mes a consultar, si es undefined se omite.
   * @param year Año a consultar, si es undefined se omite.
   */
  async searchingIncentivesEmployee(month?: number, year?: number) {
    console.log(month);
    if (this.subcriptionData !== undefined) {
      this.subcriptionData.unsubscribe();
    }
    // MES ACTUAL
    // const day = this.actualDate.getDate();
    // if (month === 1 && day < 20) {
    //   month= 12;
    //   year = year - 1;
    // } else if (day < 20) {
    //   month = month - 1;
    // }
    await this.checkSvc.getIncentivesForEmployee(this.storage.employee.username, this.storage.actualToken, month, year)
      .then(result => {
        this.subcriptionData = result.subscribe((incentives: any) => {
          console.log(incentives);
          if (incentives.data) {
            const data = incentives.data;
            this.contentData.push(data.cont_sales, data.total_incentives + EURO_DIGIT);
            data.sales.forEach((element: any) => {
              this.services.push(element);
            });
          }

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
 * Muestra más información del servicio
 * seleccionado
 */
  async moreInfo(service: ServiceEmployee) {
    await this.notification.infoEmployeeService(service).then(data => {
      if (data !== CANCEL_OPTION) {
        this.newSale(service);
      }
    });
  }

  /**
* Escucha scroll
*
* @param ev Evento touch
*/
  onScroll(ev: any) {
    this.utils.onScroll(ev, this.content);
  }

  /**
   * Scroll in lista de rankings
   */
  onScrolling() {
    this.utils.onScrolling(this.content);
  }

  /**
   * Oculta el icono de flecha para
   * subir o bajar de la lista
   */
  hiddenArrow() {
    this.utils.hiddenArrow();
  }

  handleRefresh(event) {
    console.log('refresing')
    setTimeout(() => {
      this.ngOnInit();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }


}
