import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, IonicSwiper } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotificationsService } from './services/notifications.service';
import { ComponentsModule } from './components/components.module';
import { DatacheckService } from './services/datacheck.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';


import { CookieService } from 'ngx-cookie-service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment'; 

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
    ComponentsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }), 

  ],
  exports: [ReactiveFormsModule, FormsModule, ComponentsModule], 
  //exports: [ReactiveFormsModule, FormsModule],
  providers: [
    Storage, 
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    NotificationsService, 
    DatacheckService, 
    AppVersion, 
    EmployeeService,   
    Device, 
    Network, 
    ApkUpdater, 
    File, 
    ScreenOrientation,
    CookieService ,
    InAppBrowser,

      ],
    bootstrap: [AppComponent], 
 
})
export class AppModule { }
