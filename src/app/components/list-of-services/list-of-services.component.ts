/* eslint-disable max-len */
import { Component, ViewChild } from '@angular/core';
import { Centre } from '../../models/centre';
import { NotificationsService } from '../../services/notifications.service';
import { IonSearchbar, ViewWillEnter, IonContent, ViewWillLeave, IonFabButton } from '@ionic/angular';
import { Service } from '../../models/service';
import { SliceLargeTextPipe } from '../../pipes/slice-large-text.pipe';
import { LOADING_CENTERS, SCROLLING_TIME, LOADING_SERVICES, MAX_TIME_LOADING, EMPTY_STRING } from '../../app.constants';
import { CategoryService } from '../../models/category_service';
import { DatacheckService } from '../../services/datacheck.service';
import { CentersUtilsService } from '../../services/centers-utils.service';
import { StorageService } from '../../services/storage.service';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../services/utils.service';
import { PageService } from '../../services/page.service';
import { NewSaleComponent } from '../new-sale/new-sale.component';
import { SelectSubTypeComponent } from '../select-sub-type/select-sub-type.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-list-of-services',
  templateUrl: './list-of-services.component.html',
  styleUrls: ['./list-of-services.component.scss'],
  providers: [SliceLargeTextPipe]
})
export class ListOfServicesComponent implements ViewWillEnter, ViewWillLeave {
  @ViewChild('content') content: IonContent;
  @ViewChild('search') search: IonSearchbar;
  @ViewChild('fab') fab: IonFabButton;

  // All Centers
  centros: any[] = [];
  // Centers search
  centrosShow: any[] = [];
  // Texto del buscador
  searchCenter = '';

  // Center selected
  destino: Centre;

  // Category of Services
  categoryOfServices: CategoryService[];

  // User Selecction
  userSelection = {
    category: undefined,
    services: undefined
  };

  // Var de control para la posicion de servicio
  serviceInfoPos: number;

  // Control to show
  showInfo = false;
  fabShowInfo = false;

  // Subcriptions de control
  scrollTimeOut: any;
  servicesSubcription: Subscription;


  constructor(
    private storage: StorageService,
    private notification: NotificationsService,
    public sliceText: SliceLargeTextPipe,
    private centersUtls: CentersUtilsService,
    private checkSvc: DatacheckService,
    private utils: UtilsService,
    private pageSvc: PageService,
    private iab: InAppBrowser) { }

/**
  * Carga la lista de centros del sistema
  */
async ionViewWillEnter(){
  if (this.centersUtls.centers === undefined){
    await this.centersUtls.getCenterOfSystem().then(() => {
      this.centros = this.centersUtls.centers;
      this.centrosShow = this.centros;
    }).catch(ex => {

    });
  } else{
    this.centros = this.centersUtls.centers;
    this.centrosShow = this.centros;
  }
  this.categoryOfServices = [];
}

  /**
   * Limpia el buscador de centros
   */
  clearSearch(){
    this.searchCenter = EMPTY_STRING;
    this.centrosShow = this.centros;
  }

  /**
   * Busqueda de centro
   */
  searchingCenter(){
    if (this.searchCenter !== EMPTY_STRING){
      this.centrosShow = [];
      this.centrosShow = this.centros.filter((center: any) => center.name.toUpperCase().includes(this.searchCenter.toUpperCase()));
    }
  }

  /**
   * Elección de centro por usuario
   *
   * @param centro Centro elegido
   */
  selectCenter(centro: any) {
    this.checkSvc.getServicesOf(centro.id, false, this.storage.actualToken).then((result) => {
          this.servicesSubcription = result.subscribe((category: any) => {
          this.categoryOfServices = category.data;
          this.destino = centro;
          this.destino.centre = centro.name;
        });
      });
  }

  /**
   * Cambio de selección de centros
   */
  changeCenter(){
    this.destino = undefined;
    this.searchCenter = '';
    this.centrosShow = this.centros;
  }

  /**
   * Muestra la informacion detallada del
   * servicio y subtipos
   *
   * @param index Posicion categoria seleccionada
   * @param categoryServ Servicio a mostrar
   */
  infoService(index: number, categoryServ: CategoryService){
    this.showInfo = true;
    this.userSelection.category = this.categoryOfServices[index];
    this.userSelection.services = categoryServ.services;
    this.content.scrollToTop();
  }

  /**
   * Reestablece la selección de la categoría
   * de servicio elegida por el empleado
   */
  changeService(){
    this.showInfo = false;
    this.fabShowInfo = false;
    this.serviceInfoPos = undefined;
    this.userSelection.category = undefined;
    this.userSelection.services = undefined;
  }

  /**
   * Muestra u oculta la informacion
   * del servicio seleccionado
   *
   * @param index Posicion del servicio
   */
  moreInfo(index: number) {
    this.fabShowInfo = true;
    if(this.serviceInfoPos === undefined || this.serviceInfoPos !== index){
      if(this.scrollTimeOut !== undefined){
        clearTimeout(this.scrollTimeOut);
      }
      this.serviceInfoPos = index;
      this.scrollTimeOut = setTimeout(()=>{
        const yOffset = document.getElementById('svcTitle'+index).getBoundingClientRect();
        this.content.scrollByPoint(0, yOffset.bottom - 50, SCROLLING_TIME);
      }, 100);
    } else{
      this.fabShowInfo = false;
      this.serviceInfoPos = undefined;
    }
  }

  /**
   * Muestra la tabla de subtipos de servicios
   * disponibles
   */
  async showingServices() {
    await this.notification.selectSubTypeService(SelectSubTypeComponent, this.userSelection.services)
        .then(service => {
          if(service){
            this.goBack();
            this.pageSvc.recomendedService(NewSaleComponent,this.userSelection.category.image_portrait, this.destino.centre, service);
          }
          this.fab.activated = false;
        });
  }

  /**
   * Open navigator web and load url service
   */
  async goInfoService(s: Service){
    if (!s.url || s.url != null){
      const browser = this.iab.create(s.url);
      browser.show();
    }
  }

  /**
   * Contratacion de servicio
   *
   * @param s Servicio a contratar
   *  @param category categoría de los servicios
   */
  async recommendService(s?: Service, category?: CategoryService){
    if(!s){
      if(category.services !== undefined && category.services.length > 1){
          await this.notification.selectSubTypeService(SelectSubTypeComponent, category.services)
        .then(service => {
          if(service){
            this.goBack();
            this.pageSvc.recomendedService(NewSaleComponent, category.image_portrait, this.destino.centre, service);
          }
        });
      } else{
        this.goBack();
        this.pageSvc.recomendedService(NewSaleComponent, category.image_portrait, this.destino.centre, category.services[0]);
      }
    } else{
      this.goBack();
      this.pageSvc.recomendedService(NewSaleComponent, category.image_portrait, this.destino.centre, s);
    }
  }

  /**
   * Cerrar Lista de servicios
   */
  goBack(){
    this.notification.closeModal();
  }

  /**
   * Al salir se destruye la subcripcion de los servicios
   */
  ionViewWillLeave(){
    if (this.servicesSubcription !== undefined){
      this.servicesSubcription.unsubscribe();
    }
  }

}
