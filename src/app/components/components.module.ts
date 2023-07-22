import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FaqComponent } from './faq/faq.component';
import { MyDataComponent } from './my-data/my-data.component';
import { HeaderComponent } from './header/header.component';
import { ListOfServicesComponent } from './list-of-services/list-of-services.component';
import { NewSaleComponent } from './new-sale/new-sale.component';
import { SelectSubTypeComponent } from './select-sub-type/select-sub-type.component';
import { SaleConfirmationComponent } from './sale-confirmation/sale-confirmation.component';
import { InfoFAQComponent } from './info-faq/info-faq.component';
import { EmptyViewComponent } from './empty-view/empty-view.component';
import { ImgViewerComponent } from './img-viewer/img-viewer.component';
import { UserDataComponent } from './user-data/user-data.component';
import { FooterComponent } from './footer/footer.component';
import { RefresherComponent } from './refresher/refresher.component';

@NgModule({

  declarations: [
    FaqComponent,
    MyDataComponent,
    HeaderComponent,
    ListOfServicesComponent,
    NewSaleComponent,
    SelectSubTypeComponent,
    SaleConfirmationComponent,
    InfoFAQComponent,
    EmptyViewComponent,
    ImgViewerComponent,
    UserDataComponent,
    FooterComponent,
    RefresherComponent
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
    ListOfServicesComponent,
    NewSaleComponent,
    SelectSubTypeComponent,
    SaleConfirmationComponent,
    InfoFAQComponent,
    EmptyViewComponent,
    ImgViewerComponent,
    FooterComponent
  ]
})
export class ComponentsModule { }
