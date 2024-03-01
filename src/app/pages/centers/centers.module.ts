import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CentersPageRoutingModule } from './centers-routing.module';
import { CentersPage } from './centers.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MapComponent } from 'src/app/components/map/map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentersPageRoutingModule
  ],
  declarations: [
    CentersPage,
    HeaderComponent,
    MapComponent
  ],
  exports:[
    MapComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CentersPageModule {}
