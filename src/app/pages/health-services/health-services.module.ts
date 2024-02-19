import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthServicesPageRoutingModule } from './health-services-routing.module';

import { HealthServicesPage } from './health-services.page';
import { ServicesComponent } from 'src/app/components/services/services.component';
import { ListOfServicesComponent } from 'src/app/components/list-of-services/list-of-services.component';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HealthServicesPage,
    children: [
      {
       path: '',
       redirectTo: 'services',
       pathMatch: 'full'
     },
     {
       path: 'services',
       component: ServicesComponent
     },
     {
       path: 'centres',
       component: ListOfServicesComponent
     }
   ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthServicesPageRoutingModule
  ],
  declarations: [
    HealthServicesPage,
    ListOfServicesComponent,
    ServicesComponent
  ]
})
export class HealthServicesPageModule {}
