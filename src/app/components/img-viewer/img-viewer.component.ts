import { PageService } from './../../services/page.service';
import { UtilsService } from './../../services/utils.service';
import { IonSlides, NavParams } from '@ionic/angular';
import { AfterContentChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import Swiper from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Pagination, EffectFlip, Autoplay } from 'swiper/core';

SwiperCore.use([Pagination, EffectFlip, Autoplay]);

@Component({
  selector: 'app-img-viewer',
  templateUrl: './img-viewer.component.html',
  styleUrls: ['./img-viewer.component.scss'],
})
export class ImgViewerComponent implements OnInit, AfterContentChecked, AfterViewInit {
  @ViewChild('slidesViewer') slidesViewer: IonSlides;
  @ViewChild('swiper') swiper: SwiperComponent;

  imgs = [];

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    pagination: true,
    effect: 'flip',
    autoplay: false

  };

  constructor(private params: NavParams,
    private utils: UtilsService,
    private pageSvc: PageService) { }

  ngOnInit() {
    let receiver = this.params.get('data');
    this.imgs = receiver.data.data;
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngAfterViewInit() {
    this.swiper.swiperRef.autoplay.running = true;
  }

  closeViewer() {
    this.pageSvc.closeModal();
  }


}
