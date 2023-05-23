import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { ComponentsModule } from '../../components/components.module';

import { SwiperModule } from 'swiper/angular';



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
  exports: [ComponentsModule],
})


export class DashboardPageModule {

}
