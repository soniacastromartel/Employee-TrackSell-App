import { IMG_FIELD } from './../../app.constants';
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/quotes */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { PageService } from '../../services/page.service';
import { MyDataComponent } from '../../components/my-data/my-data.component';
import { EmployeeService } from '../../services/employee.service';
import {
  SUGERENCIAS, SEND_SUGGESTIONS, LOADING_CONTENT,
  EXIT_ERROR, ACTION_PROMO_SERVICES, SUGGESTIONS_TEXT, VENTA_FORM_ID, EXIT_FORM_SALE,
  COPY_MAIL, VERSION_APP, CHANGE_LIST, SLIDES_PROMOTIONS_TIME,
  MAX_TIME_LOADING, QUERY_COUNT_ACCESS, ANDROID_TYPE, DATA_LABELS, MIN_VERSION_APP
} from '../../app.constants';
import { Platform, ViewWillEnter, IonSlides, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Employee } from '../../models/employee';
import { MyIncentivesComponent } from '../../components/my-incentives/my-incentives.component';
import { ListOfServicesComponent } from '../../components/list-of-services/list-of-services.component';
import { CentersUtilsService } from '../../services/centers-utils.service';
import { NewSaleComponent } from '../../components/new-sale/new-sale.component';
import { RankingsComponent } from '../../components/rankings/rankings.component';
import { UtilsService } from '../../services/utils.service';
import { ConnectionService } from '../../services/connection.service';
import { DatacheckService } from '../../services/datacheck.service';
import { LeagueComponent } from '../../components/league/league.component';
import { CategoryService } from 'src/app/models/category_service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, ViewWillEnter, ViewDidEnter, OnDestroy {
  @ViewChild('slideNotice') slideNoti: IonSlides;
  // Empleado actual
  user: Employee;

  // Content label show
  dataLabel = DATA_LABELS;
  sections = [
    { title: 'LISTA DE SERVICIOS', icon: 'newspaper' },
    { title: 'MI PLAN DE INCENTIVOS', icon: 'trending-up' },
    { title: 'REGISTRO DE VENTA', icon: 'logo-euro' },
    { title: 'RANKINGS', icon: 'podium' },
    { title: 'LIGA DE CENTROS', icon: 'medal' }
  ];

  // Base notices/promotions
  noticesPromotions = [{ id: 0, title: SEND_SUGGESTIONS, icon: 'mail', active: true }];

  // Options slide notices/promotions
  slideOpts = this.utils.slideOpts;

  // Actual version
  version: string;

  categoryOfServices: CategoryService[];

  // Data de promociones
  promoServices: any[];

  // Subcription de control
  centersSubcriptions: Subscription;
  promoSubcription: Subscription;
  backButton: Subscription;
  auxSub: Subscription;
  centers: any;
  servicesSubcription: Subscription;

  constructor(
    private platform: Platform,
    private notification: NotificationsService,
    private pageSvc: PageService,
    protected employeeSvc: EmployeeService,
    private centersUtls: CentersUtilsService,
    private utils: UtilsService,
    private connection: ConnectionService,
    private checkSvc: DatacheckService) {
    this.backButton = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.notification.modalCrtl.getTop().then(res => {
        // Gestion btn atras formulario de venta
        if (res !== undefined && res.id === VENTA_FORM_ID) {
          this.notification.alertBaseQuestions(EXIT_FORM_SALE.title, EXIT_FORM_SALE.msg)
            .then(response => {
              if (response) {
                this.notification.closeModal();
              }
            });
        } else if (!this.notification.loadOp && !this.notification.exitPresent) {
          this.notification.exitApp().then((result) => {
            if (result) {
              navigator['app'].exitApp();
            } else {
              this.notification.closeModal();
            }
          })
            .catch((ex) => {
              this.notification.baseThrowAlerts(EXIT_ERROR.title, ex);
            });
        }
      });
    });
  }

  async ngOnInit() {
    // Recogida de datos del usuario
    this.user = this.employeeSvc.employee;
    
    if (this.utils.version !== undefined && this.utils.version !== MIN_VERSION_APP) {
      this.version = this.utils.version;
    } else {
      await this.utils.getVersionApp().then(vers => {
        this.version = vers + '';
      }).catch(() => {
        this.version = MIN_VERSION_APP;
      });
      this.notification.loadingData(LOADING_CONTENT);
    }

    // Comprobacion centro empleado y auxiliares
    await this.checkSvc.getEmployeeCenter(this.employeeSvc.employee.username, this.employeeSvc.actualToken)
      .then((result) => {
        this.auxSub = result.subscribe((data: any) => {
          this.employeeSvc.employee.centreAux = data.data.user.centres;
          this.employeeSvc.createCenter(data.data.user).then((objCentre) => {
            this.employeeSvc.center = objCentre;
          });
          this.notification.cancelLoad();
          this.utils.cancelControlNotifications();
          this.auxSub.unsubscribe();
        });
      });

    this.slideOpts.speed = SLIDES_PROMOTIONS_TIME;
  }

  async ionViewWillEnter() {
    if (this.centersUtls.centers === undefined) {
      await this.centersUtls.localCenters();
    }

    // Se recogen las promociones actuales
    this.promoSubcription = (await this.checkSvc.getPromotionsForApp(this.employeeSvc.actualToken))
      .subscribe((promos: any) => {
        for (let x = 0; x < promos.data.length; x++) {
          if (promos.data[x] !== undefined) {
            if (x < promos.data.length-1) {
              this.noticesPromotions.push(promos.data[x]);
            } else {
              this.promoServices = promos.data[x];
            }
          } else {
            break;
          }
        }
        this.slideNoti?.startAutoplay();
      });
  }

  async ionViewDidEnter() {
    this.utils.controlToNotifications(MAX_TIME_LOADING);
    if (this.centersUtls.centers === undefined) {
      this.notification.loadingData(LOADING_CONTENT);
      setTimeout(() => {
        this.notification.cancelLoad();
      }, 2000);
    }
    if (this.platform.is(ANDROID_TYPE)) {
      // Comprobación actualizacion app
      await this.utils.checkingUpdate(this.employeeSvc.actualToken);
    }

    // Check lista de cambios, ¿version actualizada?
    this.employeeSvc.get(VERSION_APP).then(ver => {
      console.log('version actual');
      if (ver !== this.utils.version) {
        this.checkSvc.getLastChangesUpdate({ version: this.utils.version })
          .then(changes => {
            changes.subscribe((content: any) => {
              if (content.data.changes !== false) {
                const partes = content.data.changes.split(':');
                this.notification.alertChangeList(CHANGE_LIST, partes[0], partes[1]);
                // Se establece la nueva version en dispositivo y se graba la nueva en version en bd
                this.employeeSvc.set(VERSION_APP, this.utils.version);
                this.checkSvc.refreshUpdateVersion(this.employeeSvc.employee.username, VERSION_APP);
                // Por ultimo se reestablece el contador de obligacion para actualizacion de la aplicacion
                this.checkSvc.resetUpdateCount(this.employeeSvc.employee.username);
              }
            });
          }).catch(ex => {
            this.utils.createError(ex, this.employeeSvc.employee.phone, 'dashboard').then((result) => {
              this.checkSvc.setErrors(result, UtilsService);
            });
          });
      }
    });
  }

  /**
   * Gestion de banner inferior
   */
  goSlide(id: number) {
    switch (id) {
      case 0: //sugerencias
        this.notification.alertBaseQuestions(SUGGESTIONS_TEXT.title, SUGGESTIONS_TEXT.msg).then(result => {
          if (result) {
            this.utils.sendMail(this.employeeSvc.center.centre_email, COPY_MAIL, SUGERENCIAS);
          }
        });
        break;
      case 1://recomendaciones 
        this.notification.alertBaseQuestions(ACTION_PROMO_SERVICES.title, ACTION_PROMO_SERVICES.msg, this.promoServices[1].service.name + '?')
          .then(res => {
            if (res) {
              this.pageSvc.recomendedService(NewSaleComponent, (this.checkSvc.base + this.promoServices[1].category[IMG_FIELD]), this.promoServices[1].centre[0].name, this.promoServices[1].service);
            }
          });
        break;
      case 2:
        this.notification.alertBaseQuestions(ACTION_PROMO_SERVICES.title, ACTION_PROMO_SERVICES.msg, this.promoServices[0].service.name + '?')
          .then(res => {
            if (res) {
              this.pageSvc.recomendedService(NewSaleComponent, (this.checkSvc.base + this.promoServices[0].category[IMG_FIELD]), this.promoServices[0].centre[0].name, this.promoServices[0].service);
            }
          });
        break;
    }
    this.slideNoti.startAutoplay();
  }

  /**
   * Abre la sección seleccionada por el usuario
   *
   * @param option Opción seleccionada
   */
  async goAction(option: number) {
    if (this.auxSub !== undefined) {
      this.auxSub.unsubscribe();
    }
    this.checkSvc.checkAccountAccess(this.employeeSvc.employee.username, QUERY_COUNT_ACCESS)
      .then(res => {
        this.auxSub = res.subscribe(count => {
          this.utils.maxAccessPermited(count);
        });
      });

    switch (option) {
      case 0:
        this.pageSvc.listOfServices(ListOfServicesComponent);
        break;
      case 1:
        this.pageSvc.employeeIncentives(MyIncentivesComponent);
        break;
      case 2:
        this.pageSvc.recomendedService(NewSaleComponent, undefined, undefined);
        break;
      case 3:
        this.pageSvc.getRankings(RankingsComponent);
        break;
      case 4:
        this.pageSvc.getClasificationLeague(LeagueComponent);
        break;
      case 5:
        if (this.employeeSvc.center.centre === undefined) {
          this.notification.loadingData(LOADING_CONTENT);
          this.utils.controlToNotifications(MAX_TIME_LOADING);
          this.pageSvc.userMyData(MyDataComponent);
        } else {
          this.pageSvc.userMyData(MyDataComponent);
        }
        break;
    }
  }

  /**
   * Cancelacion de control de conexion
   */
  ngOnDestroy() {
    this.backButton.unsubscribe();
    if (this.centersSubcriptions !== undefined) {
      this.centersSubcriptions.unsubscribe();
    }
    if (this.promoSubcription !== undefined) {
      this.promoSubcription.unsubscribe();
    }
    if (this.connection.connectSubscription !== undefined) {
      this.connection.connectSubscription.unsubscribe();
    }
    if (this.connection.disconnectSubscription !== undefined) {
      this.connection.disconnectSubscription.unsubscribe();
    }
  }
}
