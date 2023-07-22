import { Component, HostListener, OnInit } from '@angular/core';
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
import { MenuService } from './services/menu.service';


import { APP_ID, DASHBOARD, USERNAME } from './app.constants';
import { Employee } from './models/employee';

import { SwUpdate } from '@angular/service-worker';
import { CookieService } from 'ngx-cookie-service';
import OneSignal from 'onesignal-cordova-plugin';

// import firebase from 'firebase/compat';

export const firebaseConfig = {
  production: false,
  firebase: {
    apiKey: "AIzaSyANXfU5gAehLi8rON8NE1alx3aAM6Yeeq4",
    authDomain: "pdiapp-172df.firebaseapp.com",
    projectId: "pdiapp-172df",
    storageBucket: "pdiapp-172df.appspot.com",
    messagingSenderId: "359195940071",
    appId: "1:359195940071:web:2337d5e7c6fa25c0f13e42",
    measurementId: "G-TYMHE3B0JF"
  }
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  componentes: Observable<Componente[]>;
  user: Employee;
  token: string;
  isLandscape = false;
  isDarkTheme = false;

  private tokenSubscription: Subscription | undefined;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    const isLandscape = window.innerWidth > window.innerHeight;
    this.menuService.setIsLandscape(isLandscape);
    this.menuService.updateMenuVisibility(!isLandscape);
  }

  constructor(private platform: Platform, 
    private pageSvc: PageService, 
    private router: Router, 
    private userActivityService: UserActivityService, 
    private cookieService: CookieService,
    private datacheck: DatacheckService, 
    private notification: NotificationsService, 
    private storage: StorageService, 
    private swUpdate: SwUpdate,
    private menuService: MenuService) {
    this.platform.ready().then(() => {
      document.body.setAttribute('data-theme', 'light');
      document.body.classList.toggle('dark', false);
      this.initializeApp();
      this.OneSignalInit();
      // the native platform puts the application into the background
      this.platform.pause.subscribe(async () => {
      });
      // the native platform pulls the application out from the background
      this.platform.resume.subscribe(async () => {
      });

      // firebase.initializeApp(firebaseConfig);
    });

  }

  ngOnInit() {
    const isLandscape = window.innerWidth > window.innerHeight;
    this.menuService.setIsLandscape(isLandscape);
    this.menuService.updateMenuVisibility(!isLandscape);
    this.componentes = this.datacheck.getMenuOpts();
    this.tokenSubscription = this.storage.token.subscribe(token => {
      this.token = token;
    })
    this.userActivityService.startTrackingActivity();

  }

  OneSignalInit(): void {
    // NOTE: Update the setAppId value below with your OneSignal 
    OneSignal.setAppId(APP_ID);
    OneSignal.setNotificationOpenedHandler(function (jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });
    // Prompts the user for notification permissions.
    OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
      console.log("User accepted notifications: " + accepted);
    });
  }

  ngOnDestroy() {
    this.tokenSubscription.unsubscribe();
  }

  async initializeApp() {
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // if (prefersDark.matches) {
    //   document.body.classList.toggle('dark');
    // }

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

  /**
   * Switches from ligh to dark mode
   */
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark', this.isDarkTheme);
  }

  // Add or remove the "dark" class based on if the media query matches
  toggleDarkTheme(shouldAdd) {
    document.body.classList.toggle('dark', false);
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
