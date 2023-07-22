import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonRadioGroup } from '@ionic/angular';
import { LOADING_RANKING, MAX_TIME_LOADING, MONTH_YEAR_FORMAT, SPANISH_MONTHS_VALUES } from 'src/app/app.constants';
import { EmployeeRanking } from 'src/app/models/employee_ranking';
import { DatacheckService } from 'src/app/services/datacheck.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss'],
})
export class GrupoComponent implements OnInit {
  @ViewChild('content') content: IonContent;

  rankings: Array<EmployeeRanking>;
  rankingDate: string;
  userPosition: number;
  isLoading: boolean;
  monthsValues = SPANISH_MONTHS_VALUES;
  displayFormatDate = MONTH_YEAR_FORMAT;
  month: number;
  year: number;
  dateSearch: string = 'MENSUAL'; // Set the initial segment

  constructor(private storage: StorageService,
    public utils: UtilsService,
    private checkSvc: DatacheckService,

  ) { }

  ngOnInit() {
    this.rankingDate = new Date().toISOString();
    this.rankingRefresh(this.dateSearch);
  }

  /**
 * Opciones para consultar incentivos
 */
  async filterFor($event) {
    this.rankingRefresh($event.detail.value);

  }

  /**
   * Refresca la lista del ranking
   * al seleccionar una nueva fecha
   */
  rankingRefresh(type: string) {
    console.log(this.rankingDate);
    const dateSeparator = this.rankingDate.split('-');
    this.month = Number.parseInt(dateSeparator[1]);
    this.year = Number.parseInt(dateSeparator[0]);
    const centre = undefined;
    switch (type) {
      case 'MENSUAL':
        this.getEmployeeRanking(centre, this.month, this.year);
        break;
      case 'ANUAL':
        this.getEmployeeRanking(centre, undefined, this.year);
        break;
    }
    // this.getEmployeeRanking(centre, this.month, this.year);
  }

  updateSelection($event){
    if ($event.target.className.split(' ')[0] == 'ng-untouched') {
      return;
    }
    this.rankingRefresh(this.dateSearch);
  }


  /**
   * Recoge la lista del ranking según el centro/s
   * del empleado
   */
  getEmployeeRanking(centre: number, month?: number, year?: number) {
    console.log(month);
    this.isLoading = true;
    // Control para el corte de fecha
    if (month == undefined && year == undefined) {
      const fecha = new Date();
      if (fecha.getDate() > 20) {
        month = fecha.getMonth() + 2;
      }
    }
    // Se recoge la lista actual de ranking para el filtro elegido
    this.checkSvc.getRankingsOf(centre, this.storage.actualToken, month, year).then(result => {
      result.subscribe((ranking: any) => {
        this.rankings = [];
        const collection: any[] = ranking.data.ranking;
        const rankingPosition = collection.filter((reg: any) => reg.employee === this.storage.employee.name)[0];
        if (rankingPosition !== undefined) {
          this.userPosition = rankingPosition.position;
        } else {
          this.userPosition = undefined;
        }
        // Se muestran solo los 50 primeros registros
        if (collection.length > 100) {
          this.rankings = collection.slice(0, 50);
        } else {
          this.rankings = collection;
        }

        this.isLoading = false;
      });
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
    setTimeout(() => {
      this.ngOnInit();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }


}
