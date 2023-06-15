import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './storage.service';
import { DASHBOARD, HOME } from '../app.constants';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private storage: StorageService,
    private notification: NotificationsService) { }

canActivate(): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.storage.employeeListener.subscribe(res => {
        if(res){
          resolve(true);
        } else{
          this.notification.generallyClose();
          this.router.navigate([HOME]);
          resolve(false);
        }
      });
    });
  }
}
