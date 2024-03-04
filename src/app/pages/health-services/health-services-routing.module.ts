import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthServicesPage } from './health-services.page';
import { ListOfServicesComponent } from 'src/app/components/list-of-services/list-of-services.component';
import { ServicesComponent } from 'src/app/components/services/services.component';

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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthServicesPageRoutingModule {}
