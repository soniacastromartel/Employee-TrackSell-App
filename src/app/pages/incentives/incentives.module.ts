import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncentivesPageRoutingModule } from './incentives-routing.module';

import { IncentivesPage } from './incentives.page';

import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { EmptyViewComponent } from 'src/app/components/empty-view/empty-view.component';


const routes: Routes = [
  {
    path: 'incentives',
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncentivesPageRoutingModule
  ],
  declarations: [
    IncentivesPage,
    HeaderComponent,
    EmptyViewComponent
  ],
  exports: [
    EmptyViewComponent
  ]
})
export class IncentivesPageModule {}
