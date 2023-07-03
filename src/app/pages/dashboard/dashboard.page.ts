import { IMG_FIELD, INCENTIVES, LEAGUE, RANKINGS } from './../../app.constants';
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/quotes */
import { AfterContentChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { PageService } from '../../services/page.service';
import { MyDataComponent } from '../../components/my-data/my-data.component';
import { StorageService } from '../../services/storage.service';
import {
  SUGERENCIAS, SEND_SUGGESTIONS, LOADING_CONTENT,
  EXIT_ERROR, ACTION_PROMO_SERVICES, SUGGESTIONS_TEXT, VENTA_FORM_ID, EXIT_FORM_SALE,
  COPY_MAIL, VERSION_APP, CHANGE_LIST,
  MAX_TIME_LOADING, QUERY_COUNT_ACCESS, ANDROID_TYPE, DATA_LABELS, MIN_VERSION_APP
} from '../../app.constants';
import { IonContent, ModalController, Platform, ViewWillEnter } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Employee } from '../../models/employee';
import { ListOfServicesComponent } from '../../components/list-of-services/list-of-services.component';
import { CentersUtilsService } from '../../services/centers-utils.service';
import { NewSaleComponent } from '../../components/new-sale/new-sale.component';
import { UtilsService } from '../../services/utils.service';
import { ConnectionService } from '../../services/connection.service';
import { DatacheckService } from '../../services/datacheck.service';
import { CategoryService } from 'src/app/models/category_service';
import { LOGO_PATH } from '../../app.constants';

import { Section } from '../../models/section';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Pagination, EffectFlip, Autoplay } from 'swiper/core';
import { UserActivityService } from 'src/app/services/user-activity.service';
import { Route, Router } from '@angular/router';

import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { LoaderService } from 'src/app/services/loader.service';



SwiperCore.use([Pagination, EffectFlip, Autoplay]);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardPage implements OnInit, ViewWillEnter, OnDestroy, AfterContentChecked, AfterViewInit {
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('swiper') swiperComponent: SwiperComponent;
  @ViewChild('modal') modalCrtl: ModalController;
  @ViewChild('content') content: IonContent;

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    pagination: true,
    effect: 'flip',
    autoplay: false

  };

  promotionsConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: {
      delay: 3500
    }

  };

  // Empleado actual
  user: Employee;
  logo = LOGO_PATH;
  empleado: any;

  // Content label show
  dataLabel = DATA_LABELS;
  sections: Observable<Section[]>;


  // Base notices/promotions
  noticesPromotions = [{
    id: 0,
    title: SEND_SUGGESTIONS,
    icon: 'mail',
    active: true
  }];


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
  employeeSubscription: Subscription;

  username: string;
  token: string;

  constructor(
    private platform: Platform,
    private notification: NotificationsService,
    private pageSvc: PageService,
    protected storage: StorageService,
    private centersUtls: CentersUtilsService,
    private utils: UtilsService,
    private connection: ConnectionService,
    private checkSvc: DatacheckService,
    private userActivityService: UserActivityService,
    private route: Router,
    private screenOrientation: ScreenOrientation,
    private loaderSvc: LoaderService

  ) {
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
        } if (res !== undefined && res.id === VENTA_FORM_ID) {

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

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }

  }

  async ngOnInit() {
    // Recogida de datos del usuario
    this.user = this.storage.employee;
    this.sections = this.checkSvc.getSections();

    if (this.user !== undefined) {
      this.username = this.storage.employee.username;
      this.token = this.storage.actualToken;
      this.getEmployeeInfo(this.username, this.token);
      this.processUserAndCenter();
    } else {
      this.token = this.userActivityService.getToken();
      await this.storage.getAll().then(async (result: any) => {
        this.storage.setUser(result, this.token);
        this.user = result;
        this.username = result.username;
        this.processUserAndCenter();
      });
    }
    if (this.utils.version !== undefined && this.utils.version !== MIN_VERSION_APP) {
      this.version = this.utils.version;
    } else {
      await this.utils.getVersionApp().then(vers => {
        this.version = vers + '';
      }).catch(() => {
        this.version = MIN_VERSION_APP;
      });
    }
  }

  async ionViewWillEnter() {
    if (this.centersUtls.centers === undefined) {
      await this.centersUtls.localCenters();
    }
    if (this.token == undefined) {
      this.token = this.userActivityService.getToken();
    }
    // Se recogen las promociones actuales
    this.promoSubcription = (await this.checkSvc.getPromotionsForApp(this.token))
      .subscribe((promos: any) => {
        for (let x = 0; x < promos.data.length; x++) {
          if (promos.data[x] !== undefined) {
            if (x < promos.data.length - 1) {
              this.noticesPromotions.push(promos.data[x]);
            } else {
              this.promoServices = promos.data[x];
            }
          } else {
            break;
          }
        }
      });

  }

  ngAfterViewInit() {
    this.swiperComponent.swiperRef.autoplay.running = true;
  }

  async processUserAndCenter() {
    console.log(this.centersUtls.centers);
    console.log(this.username);
    if (this.centersUtls.centers === undefined) {
       await this.centersUtls.localCenters();
    }
    if (this.platform.is(ANDROID_TYPE)) {
      // Comprobación actualizacion app
      this.utils.checkingUpdate(this.token);
    }
    // Check lista de cambios, ¿version actualizada?
    this.storage.get(VERSION_APP).then(ver => {
      if (ver !== this.utils.version) {
        this.checkSvc.getLastChangesUpdate({ version: this.utils.version })
          .then(changes => {
            changes.subscribe((content: any) => {
              if (content.data.changes !== false) {
                const partes = content.data.changes.split(':');
                this.notification.alertChangeList(CHANGE_LIST, partes[0], partes[1]);
                // Se establece la nueva version en dispositivo y se graba la nueva en version en bd
                this.storage.set(VERSION_APP, this.utils.version);
                this.checkSvc.refreshUpdateVersion(this.username, VERSION_APP);
                // Por ultimo se reestablece el contador de obligacion para actualizacion de la aplicacion
                this.checkSvc.resetUpdateCount(this.username);
              }
            });
          }).catch(ex => {
            this.utils.createError('ex', this.storage.employee.phone, 'dashboard').then((result) => {
              this.checkSvc.setErrors(result, UtilsService);
            });
          });
      }
    });
  }

  // async fetchUserData(): Promise<any> {
  //   try {
  //     const userData = await this.storage.getAll();
  //     // Process userData or return it as needed
  //     return userData;
  //   } catch (error) {
  //     // Handle error if necessary
  //     console.error('Error fetching user data:', error);
  //     throw error;
  //   }
  // }

  /**
   * Se obtienen los datos del empleado
   * @param username
   * @param token
   */
  async getEmployeeInfo(username: string, token: string) {
    await this.checkSvc.getEmployeeInfo(username, token)
      .then((result) => {
        this.auxSub = result.subscribe(async (data: any) => {
          console.log(data);
          // this.storage.employee.centreAux = data.data.user.centres;
          this.storage.createCenter(data.data.user).then(async (objCentre) => {
            console.log(objCentre);
            await this.storage.set('centre', objCentre).then(async (res) => {
              await this.storage.getAll().then(async (user: any) => {
                console.log(user);
                this.storage.saveCurrentUser(user);
                this.storage.currentUserListener.subscribe(res => {
                  console.log(res);
                  this.user = res;
                });

              });
            });

          });
        });
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
            this.utils.sendMail(this.storage.center.centre_email, COPY_MAIL, SUGERENCIAS);
          }
        });
        break;
      default://recomendaciones
        this.notification.alertBaseQuestions(ACTION_PROMO_SERVICES.title, ACTION_PROMO_SERVICES.msg, this.promoServices[id - 1].service.name + '?')
          .then(res => {
            if (res) {
              this.pageSvc.recomendedService(NewSaleComponent, (this.checkSvc.base + this.promoServices[id - 1].category[IMG_FIELD]), this.promoServices[id - 1].centre[0].name, this.promoServices[id - 1].service);
            }
          });
        break;
    }
    this.swiperComponent.swiperRef.autoplay.running = true;
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
    this.checkSvc.checkAccountAccess(this.storage.employee.username, QUERY_COUNT_ACCESS)
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
        this.route.navigate([INCENTIVES]);
        break;
      case 2:
        this.pageSvc.recomendedService(NewSaleComponent, undefined, undefined);
        break;
      case 3:
        this.route.navigate([RANKINGS]);
        break;
      case 4:
        this.route.navigate([LEAGUE]);
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

  swiperSlideChanged(e) {
  }

  promotionSlideChanged(e) {
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

}
