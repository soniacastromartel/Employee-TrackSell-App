import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonFabButton, IonSearchbar } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { EMPTY_STRING } from 'src/app/app.constants';
import { CategoryService } from 'src/app/models/category_service';
import { DatacheckService } from 'src/app/services/datacheck.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Service } from '../../models/service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PageService } from 'src/app/services/page.service';
import { NewSaleComponent } from '../new-sale/new-sale.component';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  @ViewChild('content') content: IonContent;
  @ViewChild('search') search: IonSearchbar;
  @ViewChild('fab') fab: IonFabButton;

  categories: CategoryService[] = [];
  categoriesSubscription: Subscription;
  centersSubscription: Subscription;
  services: any[] = [];
  centers: any[] = [];
  selectedCategory: any;

  constructor(
    private checkSvc: DatacheckService,
    private utils: UtilsService,
    private notification: NotificationsService,
    private pageSvc: PageService
  ) {
  }

  ngOnInit() {
    this.getServiceCategories().then(categories => {
      this.categories = categories;
    });
  }

  ionViewWillEnter() {
  }

  async getServiceCategories(): Promise<CategoryService[]> {
    try {
      const serviceCategories: any = await (await this.checkSvc.getServiceCategories()).toPromise();
      // console.log(serviceCategories);
      if (serviceCategories !== undefined) {
        return serviceCategories;
      } else {
        return [];
      }
    } catch (ex) {
      console.error(ex);
      return [];
    }
  }

  customOptions = {
    mode: 'ios',
    cssClass: 'customAlert'


  };

  async categoryChanged(category) {
    this.centers = [];
    if(this.centersSubscription) {
      this.centersSubscription.unsubscribe();
    }
    if (this.categoriesSubscription){
      this.categoriesSubscription.unsubscribe();
    }
    console.log(category);
    await this.checkSvc.getCentersByService(this.selectedCategory.id).then((result) => {
      this.centersSubscription = result.subscribe((centers: any) => {
        console.log(centers);
        if (centers !== undefined) {
          centers.forEach((center:any)=>{
            console.log(center);
            this.centers.push(center);
          });
        } else {
          this.centers = [];
        }
        console.log(this.centers);
        this.pageSvc.recomendedService(NewSaleComponent, this.selectedCategory.image, this.centers, this.selectedCategory,false);
      });
    }).catch(ex => {
      console.log(ex);
    });
  }

  handleCancel() {
    this.selectedCategory = null;
    console.log('cancelled');
  }

  /**
  * Contratacion de servicio
  *
  * @param s Servicio a contratar
  *  @param category categoría de los servicios
  */
  async recommendService(service?: Service, category?: CategoryService) {
    this.pageSvc.recomendedService(NewSaleComponent, service.image, undefined, service);
  }

  /**
   * Cerrar Lista de servicios
   */
  goBack() {
    this.notification.closeModal();
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
    if (this.centersSubscription) {
      this.centersSubscription.unsubscribe();
    }
  }





}
