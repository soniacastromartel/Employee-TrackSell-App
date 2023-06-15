import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { LOADING_RANKING, MAX_TIME_LOADING, MONTH_YEAR_FORMAT, NORMAL_TIME_WAIT, SPANISH_MONTHS_VALUES } from 'src/app/app.constants';
import { EmployeeRanking } from 'src/app/models/employee_ranking';
import { DatacheckService } from 'src/app/services/datacheck.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-mi-centro',
  templateUrl: './mi-centro.component.html',
  styleUrls: ['./mi-centro.component.scss'],
})
export class MiCentroComponent implements OnInit{
  @ViewChild('content') content: IonContent;

  rankings: Array<EmployeeRanking>;
  rankingDate: string;
  userPosition: number;
  isLoading: boolean;
  monthsValues = SPANISH_MONTHS_VALUES;
  displayFormatDate = MONTH_YEAR_FORMAT;
  month: number;
  year: number;

  constructor(private storage: StorageService,
    private notification: NotificationsService,
    public utils: UtilsService,
    private checkSvc: DatacheckService,

  ) { }

  ngOnInit() {
    this.rankingDate = new Date().toISOString();
    const dateSeparator = this.rankingDate.split('-');
    this.month = (Number.parseInt(dateSeparator[1])) - 1;
    this.year = Number.parseInt(dateSeparator[0]);
    this.getEmployeeRanking(this.storage.employee.centre_id, this.month, this.year);
  }

  /**
   * Refresca la lista del ranking
   * al seleccionar una nueva fecha
   */
  rankingRefresh() {
    const dateSeparator = this.rankingDate.split('-');
    this.month = Number.parseInt(dateSeparator[1]);
    this.year = Number.parseInt(dateSeparator[0]);
    const centre = this.storage.employee.centre_id;
    this.getEmployeeRanking(centre, this.month, this.year);
  }


  /**
   * Recoge la lista del ranking según el centro/s
   * del empleado
   */
  getEmployeeRanking(centre: number, month?: number, year?: number) {
    this.isLoading = true;
    this.notification.loadingData(LOADING_RANKING);
    this.utils.controlToNotifications(NORMAL_TIME_WAIT);
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
        this.notification.cancelLoad();
        this.utils.cancelControlNotifications();
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

  ionViewWillLeave() {

  };


}
