import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaguePageRoutingModule } from './league-routing.module';

import { LeaguePage } from './league.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaguePageRoutingModule
  ],
  declarations: [LeaguePage]
})
export class LeaguePageModule {}
