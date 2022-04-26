import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotificationsService } from './services/notifications.service';
import { ComponentsModule } from './components/components.module';
import { DatacheckService } from './services/datacheck.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { EmployeeService } from './services/employee.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SliceLargeTextPipe } from './pipes/slice-large-text.pipe';
import { TextTransformPipe } from './pipes/text-transform.pipe';
import { Device } from '@ionic-native/device/ngx';
import { Network } from '@ionic-native/network/ngx';
import ApkUpdater from 'cordova-plugin-apkupdater';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@NgModule({
  declarations: [AppComponent, SliceLargeTextPipe, TextTransformPipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule,
    IonicStorageModule.forRoot({
      name: 'icot'
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule
  ],
  exports: [ReactiveFormsModule, FormsModule, ComponentsModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NotificationsService,
    DatacheckService,
    AppVersion,
    EmployeeService,
    Storage,
    Device,
    Network,
    ApkUpdater,
    InAppBrowser,
    File,
    ScreenOrientation
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
