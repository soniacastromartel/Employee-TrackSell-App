import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RankingsPageRoutingModule } from './rankings-routing.module';

import { RankingsPage } from './rankings.page';


import { Routes, RouterModule } from '@angular/router';
import { MiCentroComponent } from 'src/app/components/mi-centro/mi-centro.component';
import { GrupoComponent } from 'src/app/components/grupo/grupo.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { EmptyViewComponent } from 'src/app/components/empty-view/empty-view.component';
import { StringToArrayPipe } from 'src/app/pipes/string-to-array.pipe';

const routes: Routes = [
  {
    path: 'rankings',
    children: [
      {
        path: 'mi-centro',
        component: MiCentroComponent
      },
      {
        path: 'grupo',
        component: GrupoComponent
      },
      {
        path: '',
        redirectTo: 'mi-centro',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankingsPageRoutingModule
  ],
  declarations: [
    RankingsPage,  
    HeaderComponent, 
    MiCentroComponent,
    GrupoComponent,
    EmptyViewComponent,
    StringToArrayPipe
  ]
})
export class RankingsPageModule {}
