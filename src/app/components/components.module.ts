import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FaqComponent } from './faq/faq.component';
import { MyDataComponent } from './my-data/my-data.component';
import { HeaderComponent } from './header/header.component';
import { MyIncentivesComponent } from './my-incentives/my-incentives.component';
import { ListOfServicesComponent } from './list-of-services/list-of-services.component';
import { NewSaleComponent } from './new-sale/new-sale.component';
import { RankingsComponent } from './rankings/rankings.component';
import { SelectSubTypeComponent } from './select-sub-type/select-sub-type.component';
import { SaleConfirmationComponent } from './sale-confirmation/sale-confirmation.component';
import { InfoFAQComponent } from './info-faq/info-faq.component';
import { LeagueComponent } from './league/league.component';
import { EmptyViewComponent } from './empty-view/empty-view.component';
import { ImgViewerComponent } from './img-viewer/img-viewer.component';

@NgModule({

  declarations: [
    FaqComponent,
    MyDataComponent,
    HeaderComponent,
    MyIncentivesComponent,
    ListOfServicesComponent,
    RankingsComponent,
    NewSaleComponent,
    SelectSubTypeComponent,
    SaleConfirmationComponent,
    InfoFAQComponent,
    LeagueComponent,
    EmptyViewComponent,
    ImgViewerComponent
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule.forRoot()],

  exports: [
    FaqComponent,
    MyDataComponent,
    HeaderComponent,
    MyIncentivesComponent,
    ListOfServicesComponent,
    RankingsComponent,
    NewSaleComponent,
    SelectSubTypeComponent,
    SaleConfirmationComponent,
    InfoFAQComponent,
    LeagueComponent,
    EmptyViewComponent,
    ImgViewerComponent
  ]})
export class ComponentsModule {}
