import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { HOME } from '../app.constants';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private employeeSvc: EmployeeService,
    private noti: NotificationsService) { }

canActivate(): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.employeeSvc.employeeListener.subscribe(res => {
        if(res){
          resolve(true);
        } else{
          this.noti.generallyClose();
          this.router.navigate([HOME]);
          resolve(false);
        }
      });
    });
  }
}
