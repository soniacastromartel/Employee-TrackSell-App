/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ViewChild } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Service } from '../../models/service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LOADING_CENTERS, LOADING_DATA,
          SCROLLING_TIME, DAY_MONTH_YEAR_FORMAT, DNI, PHONE, HC, EXTRA_DATA, IMG_WORD,
          LOADING_CONTENT, VENTA_CONFIRMADA, NO_VALIDATION_FORM, ERROR_TRACKING_DATE,
          FECHA_INVALID, CENTER_REQUIRED, CENTER_REQUIRED_RESPONSE, ERROR_CORTE_INCENTIVES, RESET_FORM_SALE,
          SALE_ERROR, ERROR, CENTRE, MIN_SERVICE_COUNT, MAX_TIME_LOADING, FORMAT_DATE_SPANISH, NOT_DISCOUNT,
          FORMAT_DATE_SPANISH_SHORT, REPEAT_SERVICE, ERROR_RECONFIGURE_SALE} from '../../app.constants';
import { NavParams, ViewWillEnter, IonContent, IonSelect} from '@ionic/angular';
import { CentersUtilsService } from '../../services/centers-utils.service';
import { UtilsService } from '../../services/utils.service';
import { StorageService } from '../../services/storage.service';
import { DatacheckService } from '../../services/datacheck.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { TextTransformPipe } from '../../pipes/text-transform.pipe';
import { PageService } from '../../services/page.service';
import { SaleConfirmationComponent } from '../sale-confirmation/sale-confirmation.component';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss'],
  providers: [TextTransformPipe]
})
export class NewSaleComponent implements ViewWillEnter{
  @ViewChild('content') content: IonContent;
  @ViewChild('selectSV') selectSV: IonSelect;
  @ViewChild('selectCR') selectCR: IonSelect;
  @ViewChild('selectCD') selectCD: IonSelect;

  // Types identification patient
  identificationOptions = [
    { title: 'DNI', value: DNI },
    { title: 'TELÉFONO', value: PHONE },
    { title: 'H.C.', value: HC }];

  // Descuentos disponibles
  discountAvailables = [];

  // Servicios disponibles
  servicesAvailables: Array<Service> = [];

  // Category service card
  categoryImgCard: string;
  // MultiOption Img Category
  categoryImgCardList: any[];

  // Servicio seleccionado
  serviceSale: any;

  //Centros disponibles
  centers: any[] = [];
  employeeCenters: any[] = [];

  // Enlace de venta
  venta = new FormGroup({
    cRealizador: new FormControl(undefined,  [Validators.required]),
    service: new FormControl(undefined, Validators.required),
    cEmployee: new FormControl(undefined, Validators.required),
    fechaVenta: new FormControl({value: '', disabled: true}),
    quantity: new FormControl(undefined, [Validators.min(MIN_SERVICE_COUNT), Validators.required]),
    idType: new FormControl(undefined, Validators.required),
    patientId: new FormControl(undefined, [Validators.minLength(6), Validators.required]),
    patientName: new FormControl(undefined, [Validators.minLength(9), Validators.required]),
    observaciones: new FormControl(''),
    discount: new FormControl(NOT_DISCOUNT)
  }, {updateOn: 'change'});

  // Obj venta final
  builderSale: any = {};

  // Extra control form
  active = false;
  activeDay = new Date();

  // Subcription de control
  saleSubcription: Subscription;
  serviceSubcription: Subscription;
  discountSubcription: Subscription;

  constructor(private notification: NotificationsService,
              private params: NavParams,
              private utils: UtilsService,
              private centersUtils: CentersUtilsService,
              private storage: StorageService,
              private checkSvc: DatacheckService,
              public textTransform: TextTransformPipe,
              private pageSvc: PageService) { }

  /**
   * Comprobacion/recogida de datos iniciales
   */
  async ionViewWillEnter() {
    // Opciones de configurador (Repetido?, preconfigurado?, ..)
    const centerRealizador = this.params.get(CENTRE);
    this.serviceSale = this.params.get(EXTRA_DATA);
    this.categoryImgCard = this.params.get(IMG_WORD);
    const isRepeat = this.params.get(REPEAT_SERVICE);

        // Carga de centros (Realizador)
        if (centerRealizador === undefined) {
          if (this.centersUtils.centers === undefined) {
            await this.centersUtils.getCenterOfSystem().then(() => {
              this.centers = this.centersUtils.centers;
            });
          } else {
            this.centers = this.centersUtils.centers;
          }
        } else {
          let cRealizador;
          this.centersUtils.centers.forEach((reg: any) =>{
            if (reg.name === centerRealizador){
              cRealizador = reg;
            }
          });
          this.centers.push(cRealizador);
          this.venta.controls.cRealizador.setValue(cRealizador);
      }

    moment.locale('es');
    this.venta.controls.fechaVenta.setValue(moment().format(FORMAT_DATE_SPANISH));
    this.venta.controls.quantity.setValue(MIN_SERVICE_COUNT);

    // Centro empleado
    if(this.storage.employee.centreAux !== undefined) {
      this.storage.employee.centreAux.forEach((c: any) => {
        this.employeeCenters.push({id: c.centre_id, name: c.centre});
      });
    } else {
      this.employeeCenters = this.centersUtils.centers.filter(reg => reg.id === this.storage.employee.centre_id);
      this.venta.controls.cEmployee.setValue(this.employeeCenters[0]);
    }

    if (!isRepeat) {
      if (this.serviceSale !== undefined) {
        this.servicesAvailables.push(this.serviceSale);
        this.venta.controls.service.setValue(this.serviceSale);
      }
    } else {
      await this.loadServiceToSale(this.serviceSale);
    }
  }

  /**
   * Recoge los servicios para el centro realizador
   * seleccionado por el usuario
   */
  servicesOfCenter() {
    if (this.venta.controls.cRealizador.value !== null) {
      this.servicesAvailables = [];
      const cRealizador = this.venta.controls.cRealizador.value;
        if(cRealizador !== undefined){
          // Recogida de servicios segun centro
          this.checkSvc.getServicesOf(cRealizador.id, true, this.storage.actualToken).then((result) => {
            this.serviceSubcription = result.subscribe((collection: any) => {
              const services: any[] = collection.data;
              this.categoryImgCardList = [];
              services.forEach((s: any) => {
                this.servicesAvailables.push(s);
              });
              this.serviceSubcription.unsubscribe();
            });
          });
        }
    }
  }

  /**
   * Se encarga de filtrar y definir la imagen de la categoria
   * segun el servicio seleccionado
   */
  async selectingCategoryImg() {
    if (this.categoryImgCard === undefined && this.venta.controls.service.value !== undefined) {
      const serv = (this.venta.controls.service.value);
      if (this.categoryImgCardList !== undefined) {
        this.categoryImgCardList.filter(reg => {
          if (serv.name.includes(reg.name.substr(0, 6))) {
            this.categoryImgCard = reg.url;
          }
        });
      }
    }
  }

  /**
   * Comprobacion de venta
   */
  checkService(ev: any){
    const check1 = this.venta.controls.cRealizador.value != undefined;
    const check2 = this.venta.controls.service.value != undefined;
    const check3 = this.venta.controls.cEmployee.value != undefined;
    this.showUnshowDataPatient((check1 && check2 && check3));
    this.selectCD.selectedText = ev.target.value.name;
  }

  /**
   * Completa la identificacion cuando se elige [HC], completando
   * el contenido a 6 digitos si no se han completado.
   */
  completeFields(){
    if (this.venta.controls.patientId.value !== undefined && this.venta.controls.idType.value === HC &&
      this.venta.controls.patientId.value.length < 6) {
      const len = this.venta.controls.patientId.value.length;
      const fillZero = 6 - len;
      let aux = '';
      for(let x=0; x<fillZero; x++){
        aux += '0';
      }
      aux = aux + this.venta.controls.patientId.value;
      this.venta.controls.patientId.setValue(aux);
    }
  }

  /**
   * Cambio de tipo de identificacion
   * para los pacientes
   */
  changeIdentification(){
    this.venta.controls.idType.setValue(undefined);
    this.venta.controls.patientId.setValue(undefined);
  }

  /**
   * Creacion del registro de venta (recomendacion)
   */
  async sendSale() {
    await this.selectingCategoryImg();

      // Obj temporal de venta
    this.builderSale = {
      employee: this.storage.employee.username,
      cRealizador: this.venta.controls.cRealizador.value,
      service: this.venta.controls.service.value,
      cEmployee: this.venta.controls.cEmployee.value,
      cantidad: this.venta.controls.quantity.value,
      portada: this.categoryImgCard,
      pacienteId: this.venta.controls.patientId.value,
      pacienteName: this.venta.controls.patientName.value,
      fecha: moment().format(FORMAT_DATE_SPANISH_SHORT),
      observaciones: this.venta.controls.observaciones.value,
      discount : this.venta.controls.discount.value
    };
    await this.pageSvc.viewContentModal(SaleConfirmationComponent, this.builderSale )
      .then(async res => {
        if (res) {
          this.builderSale = this.buildingSale();
          // Registro de venta de empleado
          await this.checkSvc.saleForEmployee(this.builderSale, this.storage.actualToken)
          .then((result) => {
            this.saleSubcription = result.subscribe(() => {
              this.notification.alertBaseNotifications(VENTA_CONFIRMADA.title, VENTA_CONFIRMADA.msg);
              this.goBack();
            }, (ex)=>{
                if((ex.error.message === NO_VALIDATION_FORM && ex.error.data !== undefined && ex.error.data.tracking_date !== undefined &&
                  ex.error.data.tracking_date[0] === ERROR_TRACKING_DATE) || ex.error.message == ERROR_CORTE_INCENTIVES){
                  this.notification.baseThrowAlerts(FECHA_INVALID.title, FECHA_INVALID.msg);
                } else if(ex.error.message === NO_VALIDATION_FORM && ex.error.data.centre_employee_id[0] === CENTER_REQUIRED_RESPONSE){
                    this.notification.baseThrowAlerts(CENTER_REQUIRED.title, CENTER_REQUIRED.msg);
                } else{
                  this.notification.baseThrowAlerts(ERROR.title, ERROR.msg);
                }
            });
          }).catch(ex => {
            this.notification.baseThrowAlerts(SALE_ERROR.title, SALE_ERROR.msg);
          });
        }
      });
  }

/**
 * Actualizacion tras carga automatica
 *
 * @param idx Posicion
 * @param ev Evento a gestionar
 */
  updateFields(idx: number, ev: any){
    switch(idx) {
      case 1: 
      this.selectSV.selectedText = ev.target.value.name;
        break;
      case 2: 
      this.selectCR.selectedText = ev.target.value.name;
        break;
    }
  }

  /**
   * Recoger los descuentos disponibles para el servicio y el
   * centro seleccionado
   */
  async getDiscountsServices(){
    this.discountAvailables = [];
    if( this.venta.controls.cRealizador.value !== -1 && this.venta.controls.service.value !== -1) {
      const centreId = this.venta.controls.cRealizador.value?.id;
      const serviceId = this.venta.controls.service.value?.id;

      if (centreId !== undefined && centreId !== -1 && serviceId !== undefined && serviceId !== -1) {
          // Se recogen los descuentos disponibles
          this.checkSvc.getAvailablesDiscounts(serviceId, centreId)
          .then((discounts) => {
            this.discountSubcription = discounts.subscribe((res)=>{
              this.discountAvailables.push({name: 'NO SE APLICA', type:'none'});
              const availablesDiscounts = new Array(res.slice(0, res.byteLength));
              for (let i=0; i<4; i++) {
                if (availablesDiscounts[0][i] !== undefined) {
                  this.discountAvailables.push(availablesDiscounts[0][i]);
                }
              }
              this.discountSubcription.unsubscribe();
            });
        });
      } else {
        this.discountAvailables = [];
      }
    }
  }

  /* CLOSE SECTION */
  goBack(){
    this.notification.closeModal();
  }

  /**
   * Vacía el formulario
   */
  clearForm() {
    this.notification.alertBaseQuestions(RESET_FORM_SALE.title, RESET_FORM_SALE.msg)
      .then(res => {
        if (res) {
          this.venta.reset();
          this.venta.controls.fechaVenta.setValue(moment().format(FORMAT_DATE_SPANISH));
          this.venta.controls.quantity.setValue(MIN_SERVICE_COUNT);
          this.content.scrollToTop(SCROLLING_TIME);
        }
      });
  }

  /**
   * Recoge el tracking anterior y extrae los datos necesarios para la recreacion
   */
    private async loadServiceToSale(dataService: any){
      this.checkSvc.getDataTracking(this.serviceSale.tracking_id, this.storage.actualToken)
        .then((r) => {
          this.serviceSubcription = r.subscribe((data)=>{
            const servPrice = data['service'][0];
            servPrice.price = dataService.price;
            servPrice.category_image_port = data['category'][0].image_portrait;
            this.serviceSale = servPrice;
            this.venta.controls.cRealizador.setValue({id: data['centre'][0]['id'], name: data['centre'][0]['name']});
            this.venta.controls.service.setValue(this.serviceSale);
            this.venta.controls.cEmployee.setValue({id: data['centre_employee_id'][0]['id'], name: data['centre_employee_id'][0]['name']});
            this.venta.controls.quantity.setValue(data['quantity']);
            this.venta.controls.idType.setValue(data['idType']);
            this.venta.controls.patientId.setValue(data['patientId']);
            this.venta.controls.patientName.setValue(data['patient_name']);
            this.venta.controls.observaciones.setValue('');
            this.servicesOfCenter();
            this.venta.updateValueAndValidity();
            this.getDiscountsServices();
          });
        }).catch((ex) =>{
          this.notification.baseThrowAlerts(SALE_ERROR.title, ERROR_RECONFIGURE_SALE);
        });
    }

  /**
   * Crea y retorna el registro de venta final
   *
   * @returns Obj venta
   */
  private buildingSale() {
    return {
      employee: this.storage.employee.username,
      idType: this.venta.controls.idType.value,
      patientId: this.venta.controls.patientId.value,
      patient_name: this.venta.controls.patientName.value,
      centre_id: this.venta.controls.cRealizador.value.id,
      centre_employee_id: this.venta.controls.cEmployee.value.id,
      service_id: this.venta.controls.service.value.id,
      quantity: this.venta.controls.quantity.value,
      tracking_date: moment().format(DAY_MONTH_YEAR_FORMAT),
      observations: this.venta.controls.observaciones.value,
      discount: this.venta.controls.discount.value.name
    };
  }

/**
 * Metodo de ayuda para mostrar/ocultar opciones
 * en formulario
 *
 * @param value Condicional
 */
  private showUnshowDataPatient(value: boolean){
    this.active = value;
    if(this.active){
      this.content.scrollByPoint(0, 250, SCROLLING_TIME);
    }
  }
}
