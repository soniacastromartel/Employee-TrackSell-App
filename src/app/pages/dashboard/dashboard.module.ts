import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { ComponentsModule } from '../../components/components.module';

import { SwiperModule } from 'swiper/angular';

import Swiper from 'swiper';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

// import 'swiper/css';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    DashboardPageRoutingModule, 
    ComponentsModule,
    SwiperModule

  ],
  declarations: [DashboardPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ComponentsModule],
})


export class DashboardPageModule {

}
