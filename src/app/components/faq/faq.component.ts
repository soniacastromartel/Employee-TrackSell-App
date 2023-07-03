/* eslint-disable max-len */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, ViewWillEnter } from '@ionic/angular';
import { NotificationsService } from '../../services/notifications.service';
import { DatacheckService } from '../../services/datacheck.service';
import { UtilsService } from '../../services/utils.service';
import { LOADING_CONTENT, NO_DATA_FAQ, MAX_TIME_LOADING, MIN_VERSION_APP, EMPTY_STRING } from '../../app.constants';
import { Subscription } from 'rxjs';
import { InfoFAQComponent } from '../info-faq/info-faq.component';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, ViewWillEnter {
  @ViewChild('content') content: IonContent;
  @ViewChild('search') search: IonSearchbar;

  // Version app
  version: string;

  // Control de seccion de tipo de pregunta
  optCtrl = [false, false, false, false, false, false];

  // Info empty view
  noData = NO_DATA_FAQ;

  // Time base search
  timeOutSearch;

  // Control muestra actualizacion pendiente
  isShowPendingUpdate: boolean;

  /**
   * Preguntas y respuestas a mostrar
   */
  optionsFAQ = [];
  optionsShow: Array<any> = [];

  // Subcripcion de control
  subcriptionFAQ: Subscription;

  constructor(
    private notification: NotificationsService,
    private checkSvc: DatacheckService,
    private utils: UtilsService,
    public storage: StorageService
  ) { }

  /**
   * Se recoge la version actual de la app
   * y se cargan el contenido
   */
  async ngOnInit() {
      if (this.utils.version !== undefined) {
        this.version = this.utils.version;
      } else {
      await this.utils.getVersionApp().then(version => {
          this.version = version + '';
      }).catch(() => {
        this.version = MIN_VERSION_APP;
        });
    }
      this.subcriptionFAQ = (await this.checkSvc.getOptionsFAQ())
        .subscribe((result: any) => {
          if (result !== undefined) {
            this.optionsFAQ = result.data;
            this.optionsFAQ?.forEach((element) => {
              this.categorizeFAQ(element, false);
            });
          }

      });
  }

  ionViewWillEnter(){
    // Mostrar opcion descarga actualizacion en FAQ?
    this.isShowPendingUpdate = this.storage.employee !== undefined &&
    this.utils.pendingUpdate;
  }

  /**
   * Gestión de secciones de preguntas
   *
   * @param opt opción de usuario
   */
  async openOptFAQ(opt: number) {
    for (let x = 0; x < this.optCtrl.length; x++){
      if (x === opt) {
        if (this.optCtrl[opt]){
          this.optCtrl[opt] = false;
        } else{
          this.optCtrl[opt] = true;
        }
        if (this.optionsShow[opt].ic === 'add-circle'){
          this.optionsShow[opt].ic = 'remove-circle';
        } else{
          this.optionsShow[opt].ic = 'add-circle';
        }
      } else {
        this.optCtrl[x] = false;
        if (this.optionsShow[x] !== undefined){
          this.optionsShow[x].ic = 'add-circle';
        }
      }
    }
    const yOffset = document.getElementById('questionFAQ')?.offsetHeight;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    opt < 2 ?
      this.content.scrollByPoint(0, yOffset+20, 1500) :
      this.content.scrollByPoint(0, yOffset+180, 1500) ;
  }

  /**
   * Reset icon default
   */
  resetValues() {
    for (let x = 0; x < this.optCtrl.length; x++) {
      this.optCtrl[x] = false;
      this.optionsFAQ[x].ic = 'add-circle';
    }
  }

  /**
   * Alert con pregunta y respuesta
   *
   * @param question Pregunta seleccionada
   * @param posCategory Categoria seleccionada
   * 
   */
  showQuestion(question: any, posCategory: number) {
      this.notification.showQuestionFAQ(
      InfoFAQComponent,
      this.optionsShow[posCategory].categoria,
      question.pregunta.toUpperCase(),
      question.respuesta,
      question.images
    );
  }

  /**
   * Gestión de búsqueda en FAQ
   */
  userSearching() {
    if (this.timeOutSearch !== undefined) {
      clearTimeout(this.timeOutSearch);
    }
    const search = this.search.value;
    if (search !== EMPTY_STRING) {
      this.resetValues();
      this.optionsShow = [];
      const exclude = [];
        this.optionsFAQ.forEach((r) => {
          // Si existe la información se desoculta el grupo
          if (r.categoria.toUpperCase().includes(search.toUpperCase()) ||
            r.pregunta.toUpperCase().includes(search.toUpperCase())) {
            this.categorizeFAQ(r, false);
            exclude.push(r.categoria);
            // Comprobacion ocurrencias encontradas
            const existe = this.optionsShow.filter(reg => reg.categoria === r.categoria);
            existe.forEach(element => {
              element.hidden = false;
            });
          } else {
            // En caso contrario se recategorizan y se ocultan
            if (!exclude.includes(r.categoria)) {
              this.categorizeFAQ(r, true);
            }
        }
        });
    }
    this.timeOutSearch = setTimeout(() => {
      if (search === '') {
        this.cancelSearch();
      }
    }, 5000);
  }

  /**
   * Categoriza los tipos de preguntas para el FAQ
   *
   * @param element Elemento a comprobar
   */
    categorizeFAQ(element: any, status: boolean) {
    const code = element.code + ''.split('.');
    if (this.optionsShow[code[0]] === undefined) {
          this.optionsShow[code[0]] = {
            code: element.code,
            ic: element.ic,
            hidden: status,
            categoria: element.categoria,
            data: [{
              pregunta: element.pregunta,
              respuesta: element.respuesta,
              images: element.images,
            }]
          };
    } else {
          this.optionsShow[code[0]].data.push({
            pregunta: element.pregunta,
            respuesta: element.respuesta,
            images: element.images,
          });
    }
  }

  /**
   * Cancelar búsqueda
   */
  cancelSearch() {
    this.optionsShow = [];
    this.resetValues();
    this.optionsFAQ.forEach(reg => {
      this.categorizeFAQ(reg, false);
    });
  }

  /**
   * Back. Cierra la ventana modal y vuelve al componente principal
   */
  backFAQ() {
    this.notification.closeModal();
  }

  /**
   * Descarga de actualizacion pospuesta
   * por parte del usuario
   */
  reUpdatingApp(){
    this.utils.downloadingUpdate(false);
  }
}
