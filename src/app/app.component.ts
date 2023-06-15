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
import { StorageService } from './services/storage.service';
import { UserActivityService } from './services/user-activity.service';

import { DASHBOARD, USERNAME } from './app.constants';
import { Employee } from './models/employee';

import { SwUpdate } from '@angular/service-worker';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  componentes: Observable<Componente[]>;
  user: Employee;
  token: string;
  private tokenSubscription: Subscription | undefined;

  constructor(private platform: Platform, private pageSvc: PageService, private router: Router, private userActivityService: UserActivityService, private cookieService: CookieService,
    private datacheck: DatacheckService, private notification: NotificationsService, private storage: StorageService, private swUpdate: SwUpdate) {
    this.platform.ready().then(() => {
      this.initializeApp();
      // the native platform puts the application into the background
      this.platform.pause.subscribe(async () => {
      });
      // the native platform pulls the application out from the background
      this.platform.resume.subscribe(async () => {
      });

    });
  }

  ngOnInit() {
    this.componentes = this.datacheck.getMenuOpts();
    this.tokenSubscription = this.storage.token.subscribe(token => {
      this.token = token;
    })
    this.userActivityService.startTrackingActivity();

  }

  ngOnDestroy() {
    this.tokenSubscription.unsubscribe();
  }

  async initializeApp() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      document.body.classList.toggle('dark');
    }

    //it checks token validity and depending on it, redirects to dashboard or to login.
    const token = await this.cookieService.get('token');
    const isValid = await this.userActivityService.isTokenValid(token);
    if (isValid) {
      this.storage.getAll().then((result) => {
        this.router.navigate([DASHBOARD], {
          state: { data: result }
        });
      })
    } else {
      this.router.navigate(['/home']);
    }

    //it checks if there’s an update available and subscribes to it.
    if (this.swUpdate.available) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('Hay una nueva versión disponible. ¿Desea descargarla?'))
          window.location.reload();
      });
    }
  }

  private reloadApp(): void {
    this.platform.ready().then(() => {
      location.reload();
    });
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
    } 
  }

  openFAQ() {
    this.notification.pageSvc.openFAQ(FaqComponent, true);
  }

  logOut() {
    this.userActivityService.logout();
  }

  gotoMyCentre() {
    this.pageSvc.userMyData(MyDataComponent);
  }
  gotoMyData() {
    this.pageSvc.userMyData(UserDataComponent);
  }

}
