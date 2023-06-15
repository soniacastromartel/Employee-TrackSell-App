import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RankingsPage } from './rankings.page';
import { MiCentroComponent } from 'src/app/components/mi-centro/mi-centro.component';
import { GrupoComponent } from 'src/app/components/grupo/grupo.component';

const routes: Routes = [
  {
    path: '',
    component: RankingsPage,
    children: [
       {
        path: '',
        redirectTo: 'mi-centro',
        pathMatch: 'full'
      },
      {
        path: 'mi-centro',
        component: MiCentroComponent
      },
      {
        path: 'grupo',
        component: GrupoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankingsPageRoutingModule {}
