import { DEFAULT_TIME_1S, WAIT_TO_SLIDE, SLIDES_PROMOTIONS_TIME } from './../../app.constants';
import { PageService } from './../../services/page.service';
import { UtilsService } from './../../services/utils.service';
import { NavParams, IonSlides } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-img-viewer',
  templateUrl: './img-viewer.component.html',
  styleUrls: ['./img-viewer.component.scss'],
})
export class ImgViewerComponent implements OnInit {
  @ViewChild('slidesViewer') slidesViewer : IonSlides;

  imgs = [];
  slidesPos = 0;
  slidesOpts =  this.utils.slideOpts;

  constructor(private params: NavParams,
              private utils: UtilsService,
              private pageSvc: PageService) { }

  ngOnInit() {
    let receiver =  this.params.get('data');
    this.imgs = receiver.data.data;
    this.slidesPos = receiver.data.pos;
  }

  async slidePlay(){
    this.slidesViewer.mode = 'ios';
    this.slidesViewer.pager = true;
    this.slidesViewer.slideTo(this.slidesPos, SLIDES_PROMOTIONS_TIME);   
    this.slidesViewer.startAutoplay();
  }

  async refreshViewer() {
    this.slidesViewer.isEnd().then((isEnd)=>{
      if (isEnd) {
        setTimeout(()=> {
          this.slidesViewer.slideTo(0, DEFAULT_TIME_1S)
        }, WAIT_TO_SLIDE);
      } else {
        this.slidesViewer.startAutoplay();
      }      
    }); 
  }

  closeViewer() {
    this.pageSvc.closeModal();
  }

}
