import { ImgViewerComponent } from './../img-viewer/img-viewer.component';
import { PageService } from './../../services/page.service';
import { LOGO_PATH } from './../../app.constants';
import { AfterContentChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavParams } from '@ionic/angular';
import { NotificationsService } from '../../services/notifications.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-info-faq',
  templateUrl: './info-faq.component.html',
  styleUrls: ['./info-faq.component.scss'],
})
export class InfoFAQComponent implements OnInit {
  @ViewChild('content') content: IonContent;
  // Path logo base
  logo = LOGO_PATH;

  // Data a mostrar
  data = {
    title: undefined,
    pregunta: undefined,
    respuesta: undefined,
    images: undefined
  };

  constructor(
    private params: NavParams,
    private notification: NotificationsService,
    private utils: UtilsService,
    private pageSvc: PageService
  ) {

  }

  // Se recoge la informacion del FAQ a mostrar
  ngOnInit() {
    const data = this.params.get('data');
    console.log(data);
    if (data !== undefined) {
      this.data.title = data.title;
      this.data.pregunta = data.pregunta;
      this.data.respuesta = data.respuesta;
      this.data.images = data.images;
    }
  }

  /**
   * Ver img fullscreen
   *
   * @param photo Imagen a visualizar
   */
  seeImg() {
    const extra = {
      data: this.data.images,
    };
    this.pageSvc.viewContentModal(ImgViewerComponent, { data: extra });
  }

  /**
   * Regresar SECTION FAQ
   */
  back() {
    this.notification.closeModal();
  }

}
