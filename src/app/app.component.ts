import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Componente } from './models/componente';
import { DatacheckService } from './services/datacheck.service';
import { NotificationsService } from './services/notifications.service';
import { FaqComponent } from './components/faq/faq.component';
import { MyDataComponent } from './components/my-data/my-data.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { PageService } from './services/page.service';
import { Router } from '@angular/router';
import { EmployeeService } from './services/employee.service';

import { DASHBOARD, USERNAME } from './app.constants';
import { Employee } from './models/employee';

import { SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  componentes: Observable<Componente[]>;
  user: Employee;
  token: string;
  private tokenSubscription: Subscription |undefined;

  constructor(private platform: Platform, private pageSvc: PageService, private router: Router,
    private datacheck: DatacheckService, private notification: NotificationsService, private employeeSvc: EmployeeService, private swUpdate: SwUpdate) {
    this.platform.ready().then(() => {
      this.initializeApp();

      // the native platform puts the application into the background
      this.platform.pause.subscribe(async () => {
        alert('Pause event detected');
      });

      // the native platform pulls the application out from the background
      this.platform.resume.subscribe(async () => {
        alert('Resume event detected');
      });

    });
  }

  ngOnInit() {
    this.componentes = this.datacheck.getMenuOpts();
    this.tokenSubscription = this.employeeSvc.token.subscribe(token => {
      this.token = token;
    })
  
    

  }

  ngOnDestroy() {
    this.tokenSubscription.unsubscribe();
  }

   initializeApp() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      document.body.classList.toggle('dark');
    }

    if (this.swUpdate.available) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('Hay una nueva versión disponible. ¿Desea descargarla?'))
          window.location.reload();
      });
    }

  }

  // Open FAQ App
  openFAQ() {
    this.notification.pageSvc.openFAQ(FaqComponent, true);
  }

  logOut() {
    this.employeeSvc.delete('name');
    this.employeeSvc.delete('dni');
    this.employeeSvc.deleteToken();
    this.router.navigate(['/home']);


  }

  gotoMyCentre() {
    this.pageSvc.userMyData(MyDataComponent);
  }
  gotoMyData() {
    this.pageSvc.userMyData(UserDataComponent);
  }

  click(i) {
    switch (i) {
      case 0:
        this.gotoMyData();
        break;
      case 1:
        this.gotoMyCentre();
        break;
      case 2:
        this.openFAQ();
        break;
      case 3:
        this.logOut();
        break;

    }  // componente.click;
  }
}
