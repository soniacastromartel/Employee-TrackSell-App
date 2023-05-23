import { Component, OnInit } from '@angular/core';
import { DATA_LABELS, USER_ICONS } from 'src/app/app.constants';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
})
export class UserDataComponent implements OnInit {
  user: Employee;
  dataLabels = DATA_LABELS;
  icons= USER_ICONS;
  qrData = null;
  createdCode = null;
  scannedCode = null;

  constructor(private employeeSvc: EmployeeService, private notification: NotificationsService,) { 
    
  }

  ngOnInit() {
    this.user = this.employeeSvc.employee;
    console.log(this.user);

  }

  goBack() {
    this.notification.closeModal();

  }

  openGalery(){
    console.log('open galery');
  }

  

}
