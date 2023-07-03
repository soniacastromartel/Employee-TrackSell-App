import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonDatetime, IonRadioGroup, ViewWillLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SPANISH_MONTHS_VALUES, COLUMNS_HEADER_GLOBAL_LEAGUE, COLUMNS_HEADER_GLOBAL_WITH_DETAILS, COLUMNS_HEADER_CENTRE_LEAGUE, MONTH, NONE, DISPLAY_BLOCK } from 'src/app/app.constants';
import { DatacheckService } from 'src/app/services/datacheck.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PageService } from 'src/app/services/page.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Location } from '@angular/common';
import { MenuService } from 'src/app/services/menu.service';


@Component({
  selector: 'app-league',
  templateUrl: './league.page.html',
  styleUrls: ['./league.page.scss'],
})
export class LeaguePage implements OnInit, ViewWillLeave {
 @ViewChild('selectorDate') selectorDate: IonDatetime;
  @ViewChild('typeGroup') typeGroup: IonRadioGroup;
  @ViewChild('content') content: IonContent;

  monthValues = SPANISH_MONTHS_VALUES;
  typeSearch = [
    { name: 'MENSUAL', value: 'month' },
    { name: 'ANUAL', value: 'year' }
  ];

  consultingMonth: boolean;
  dateSearch = '';
  dateValue = null;
  actualYear: number;
  searchMonth: number;
  isScrolling: boolean;
  // isLandscape: boolean;

  date = new Date();
  myDate;


  columnsHeader = [];
  dataShow = undefined;
  centreDetails = undefined;
  loadingData = this.notification.loadData;

  subcriptionLeague: Subscription;

  constructor(private pageSvc: PageService,
    private location: Location,
    private checkSvc: DatacheckService,
    private storage: StorageService,
    private notification: NotificationsService,
    private screenOrientation: ScreenOrientation,
    public utils: UtilsService,
    private menuService: MenuService) {
    this.myDate = this.date.toISOString();
    this.dateValue = this.date;
  }

  /**
   * Bloquea la orientación de la pantalla del dispositivo a horizontal y carga los datos de la liga según la fecha default del selector.
   */
  async ngOnInit() {
    this.menuService.setIsLandscape(true);
    this.menuService.updateMenuVisibility(false);
    console.log('onInit');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.columnsHeader = COLUMNS_HEADER_GLOBAL_LEAGUE;
    this.selectingType();
    this.getClasificationLeague(null);
    this.isScrolling = false;

  }

  /**
   * Detecta cambio del dateTime
   * Consulta de liga y detalle de centro en liga
   *
   * @param centre Centro a consultar
   */
  async getClasificationLeague(centre: string, ev: any = null) {
      this.loadingData = true;
      if (this.subcriptionLeague !== undefined) {
        this.subcriptionLeague.unsubscribe();
      }
      if (this.selectorDate !== undefined) {
        this.dateValue = new Date(this.selectorDate.value);
        this.actualYear = this.dateValue.getFullYear();
        this.searchMonth = null;
        if ((this.actualYear + '').length > 10 || (this.actualYear + '').length < 5) {
          this.actualYear = Number.parseInt(this.actualYear + ''.substring(0, 4));
        } else if ((this.actualYear + '').length > 5) {
          const divid = (this.actualYear + '').split('/');
          this.actualYear = Number.parseInt(divid[1]);
        }

        if (this.consultingMonth) {
          this.searchMonth = new Date(this.dateValue).getMonth() + 1;
          this.dateSearch = SPANISH_MONTHS_VALUES[this.searchMonth - 1] + '/' + this.actualYear;
        } else {
          this.dateSearch = this.actualYear + '';
        }
      }

      this.columnsHeader = COLUMNS_HEADER_GLOBAL_LEAGUE;
      await this.checkSvc.getClasificationLeague(centre, this.searchMonth, this.actualYear, this.storage.actualToken)
        .then(data => {
          this.subcriptionLeague = data.subscribe(res => {
            this.utils.cancelControlNotifications();
            centre !== null ? this.centreDetails = centre : this.centreDetails = undefined;
            if (centre === null && this.consultingMonth) {
              this.columnsHeader = COLUMNS_HEADER_GLOBAL_LEAGUE;
            } else if (centre === null && !this.consultingMonth) {
              this.columnsHeader = COLUMNS_HEADER_GLOBAL_WITH_DETAILS
            } else {
              this.columnsHeader = COLUMNS_HEADER_CENTRE_LEAGUE;
            }
            this.dataShow = Object.keys(res).map(key => (res[key]));
            this.loadingData = false;
            this.centreDetails !== undefined ?
              this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT) :
              this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
          
          });
        });
    
  }

  /** Detecta cambio del radioGroup
   * Cambia la consulta [MENSUAL - ANUAL]
   */
  async selectingType() {
    console.log(this.dateSearch);
    if (this.typeGroup) {
      this.consultingMonth = this.typeGroup.value === MONTH;
      await this.getDateFormat(this.typeGroup.value);
    } else {
      this.consultingMonth = true;
      await this.getDateFormat(MONTH);
    }
    console.log(this.consultingMonth);
  }

  /**
   * Configura los parametros de consulta y el label a mostrar
   * @param typeSearch 
   */
  async getDateFormat(typeSearch: string) {
    if (this.consultingMonth) {
      this.actualYear = this.dateValue.getFullYear();
      this.searchMonth = new Date(this.dateValue).getMonth() + 1;
      this.dateSearch = SPANISH_MONTHS_VALUES[this.searchMonth - 1] + '/' + this.actualYear;
    } else {
      this.dateValue = new Date();
      this.actualYear = this.dateValue.getFullYear();
      this.dateSearch = this.actualYear + '';
    }
      this.selectorDate !== undefined ?
        this.selectorDate.value = this.dateSearch :
        undefined;
      !this.loadingData ? this.getClasificationLeague(null) : undefined;

  }

  /**
   * Escucha scroll
   *
   * @param ev Evento touch
   */
  onScroll(ev: any) {
    this.utils.onScroll(ev, this.content);
    this.auxScrollingView();
  }

  /**
   * Scroll in lista de rankings
   */
  onScrolling() {
    this.utils.onScrolling(this.content);
  }

  /**
   * Metodo auxiliar para ocutar cabecera en scroll
   * y ampliar el campo de vision de registros
   */
  auxScrollingView() {
    if (this.centreDetails === undefined && !this.isScrolling) {
      this.isScrolling = true;
      document.getElementById('radioOptions').style.display = NONE;
      setTimeout(() => {
        document.getElementById('radioOptions').style.display = DISPLAY_BLOCK;
        this.isScrolling = false;
      }, 3000);
    }
  }

  /**
   * Reseteo de valores de busqueda (pickerDate)
   */
  resetValues() {
    this.searchMonth = this.dateValue.getMonth() + 1;
    this.actualYear = this.dateValue.getFullYear();
    this.dateSearch = SPANISH_MONTHS_VALUES[this.searchMonth - 1] + '/' + this.actualYear;
    this.myDate = new Date(this.date);
    this.selectingType()
  }

  /**
   * Oculta el icono de flecha para
   * subir o bajar de la lista
   */
  hiddenArrow() {
    this.utils.hiddenArrow();
  }

  /**
   * Seleccion de nuevo fecha para consulta
   */
  selectYear(): void {
    this.selectorDate.open();
  }

  /**
   * Cierra la liga de centros
   */
  closedLeague(): void {
    this.location.back();
  }

  /**
   * Fuerza la rotacion del dispositivo a su
   * orientacion original
   */
  ionViewWillLeave(): void {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

}
