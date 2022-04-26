import { DEFAULT_TIME_1S } from './../../app.constants';
/* eslint-disable radix */
import { RADIO_LABEL_EN_CURSO, RADIO_LABEL_YEAR } from './../../app.constants';
import { RADIO_LIST_ID, SCROLLING_TIME } from './../../app.constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import {
  SPANISH_MONTHS_VALUES, ACTUAL_DATE, MONTH_YEAR, YEAR, MONTH_YEAR_FORMAT,
  YEAR_FORMAT, RADIO_LABEL_MESYEAR, LOADING_RANKING, TYPE_RANKING_CENTRO, TYPE_RANKING_GRUPO, IC_ARROW_UP, IC_ARROW_DOWN, NONE
} from '../../app.constants';
import { UtilsService } from '../../services/utils.service';
import { EmployeeService } from '../../services/employee.service';
import { IonContent, IonSegment, IonSlides, IonRadioGroup } from '@ionic/angular';
import { DatacheckService } from '../../services/datacheck.service';
import { EmployeeRanking } from '../../models/employee_ranking';
import { MAX_TIME_LOADING, NO_DATA_FOUND } from '../../app.constants';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss'],
})
export class RankingsComponent implements OnInit {
  // Selector de componentes
  @ViewChild('content') content: IonContent;
  @ViewChild('selector') selector: IonSegment;
  @ViewChild('slides') slides: IonSlides;
  @ViewChild('radioGroup') radioGroup: IonRadioGroup;

  // Constant usage
  monthsValues = SPANISH_MONTHS_VALUES;
  displayFormatDate = MONTH_YEAR_FORMAT;
  emptyData = NO_DATA_FOUND;

  // Rango selecionado
  rankingDate: string;

  // Listado de ranking
  rankings: Array<EmployeeRanking>;

  // Control action data
  isLoading: boolean;
  isDetails: boolean;

  // Tipo de busqueda de fecha
  selectedRadioItem: string;

  // Posicion actual user
  userPosition: number;

  // Selector de rango de fechas
  radioList = [
    {
      id: '1',
      name: RADIO_LIST_ID,
      value: ACTUAL_DATE,
      text: RADIO_LABEL_EN_CURSO,
    }, {
      id: '2',
      name: RADIO_LIST_ID,
      value: MONTH_YEAR,
      text: RADIO_LABEL_MESYEAR,
    }, {
      id: '3',
      name: RADIO_LIST_ID,
      value: YEAR,
      text: RADIO_LABEL_YEAR,
    },
  ];

  constructor(private employeeSvc: EmployeeService,
              private noti: NotificationsService,
              public utils: UtilsService,
              private dataCheck: DatacheckService ) { }

  ngOnInit() {
    this.rankingDate = new Date().toISOString();
    // Recogemos los datos del ranking para el empleado actual
    this.getEmployeeRanking(this.employeeSvc.employee.centre_id);
    this.selectedRadioItem = ACTUAL_DATE;
    this.isDetails = false;
  }

  /**
   * Select rango de fechas de busqueda
   */
  selectDateRankings(){
    this.isDetails = !this.isDetails;
  }

  /**
   * Recoge la lista del ranking según el centro/s
   * del empleado
   */
  getEmployeeRanking(centre: number, month?: number, year?: number) {
    this.isLoading = true;
    this.noti.loadingData(LOADING_RANKING);
    this.utils.controlToNotifications(MAX_TIME_LOADING);

    // Control para el corte de fecha
    if(month === undefined && year === undefined) {
      const fecha = new Date();
        if(fecha.getDate() > 20 ) {
          month = fecha.getMonth() +2;
      }
    }

    // Se recoge la lista actual de ranking para el filtro elegido
    this.dataCheck.getRankingsOf(centre, this.employeeSvc.actualToken, month, year).then(result => {
        result.subscribe((ranking: any) => {
          this.rankings = [];
          const collection: any[] = ranking.data.ranking;
          const rankingPosition = collection.filter((reg: any) => reg.employee === this.employeeSvc.employee.name)[0];

          if(rankingPosition !== undefined){
            this.userPosition = rankingPosition.position;
          } else{
            this.userPosition = undefined;
          }

          // Se muestran solo los 50 primeros registros
          if (collection.length > 100) {
            this.rankings = collection.slice(0, 50);
          } else {
            this.rankings = collection;
          }
          this.noti.cancelLoad();
          this.utils.cancelControlNotifications();
          this.isLoading = false;
      });
    });
  }

  /**
   * Selección del tipo filtro para
   * el ranking
   *
   * @param ev Evento selección de usuario
   */
  typeRanking(ev: any) {
    if (ev.detail?.value === TYPE_RANKING_CENTRO) {
      this.slides?.slideTo(0, DEFAULT_TIME_1S);
      } else {
        this.slides?.slideTo(1, DEFAULT_TIME_1S);
      }
  }

  /**
   * Gestion del slider de tipo de rankings
   *
   * @param pos Tipo de ranking
   */
  toSlides(pos: number) {
    this.selectedRadioItem = ACTUAL_DATE;
    this.radioGroup.value = undefined;
    switch (pos) {
      case 0:
        this.selector.value = TYPE_RANKING_CENTRO;
        break;
      case 1:
        this.selector.value = TYPE_RANKING_GRUPO;
        break;
    }
    this.radioGroup.value = ACTUAL_DATE;
  }

  /**
   * Refresca la lista del ranking
   * al seleccionar un nuevo month/year
   */
  rankingRefresh(type: number) {
    const dateSeparator = this.rankingDate.split('-');
    const month = Number.parseInt(dateSeparator[1]);
    const year = Number.parseInt(dateSeparator[0]);
    const centre = this.selector.value === TYPE_RANKING_CENTRO
    ? this.employeeSvc.employee.centre_id
    : undefined;

    if(type === 1){
      this.getEmployeeRanking(centre, month, year);
    } else{
      this.getEmployeeRanking(centre, undefined, year);
    }
  }

  /**
   * Seleccion de radio de consulta Rankings
   * [MES ACTUAL, MES Y AÑO, AÑO]
   *
   * @param event User event
   */
  radioSelect(event: any) {
    const userOption = event.detail.value;
    this.rankingDate = new Date().toISOString();
    const centre = this.selector.value === TYPE_RANKING_CENTRO
    ? this.employeeSvc.employee.centre_id
    : undefined;
    switch (userOption) {
      case ACTUAL_DATE:
        this.selectDateRankings();
        this.getEmployeeRanking(centre);
        break;
      case MONTH_YEAR:
        this.displayFormatDate = MONTH_YEAR_FORMAT;
        break;
      case YEAR:
        this.displayFormatDate = YEAR_FORMAT;
        break;
    }
    this.selectedRadioItem = userOption;
  }

  /**
   * Escucha scroll
   *
   * @param ev Evento touch
   */
  onScroll(ev: any){
    this.utils.onScroll(ev, this.content);
  }

  /**
   * Scroll in lista de rankings
   */
  onScrolling(){
    this.utils.onScrolling(this.content);
  }

  /**
   * Oculta el icono de flecha para
   * subir o bajar de la lista
   */
  hiddenArrow(){
    this.utils.hiddenArrow();
  }

   /* CLOSE SECTION */
  goBack(){
    this.noti.closeModal();
  }
}
