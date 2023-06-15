import { Component, OnInit } from '@angular/core';
import { DATA_LABELS, USER_ICONS } from 'src/app/app.constants';
import { Employee } from 'src/app/models/employee';
import { StorageService } from 'src/app/services/storage.service';
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
 

  constructor(private storage: StorageService, private notification: NotificationsService,) { 
    
  }

  ngOnInit() {
    this.storage.currentUserListener.subscribe(res=>{
      console.log(this.storage.employee);
      if(res){
        this.user= res;
      }else{
        this.user = this.storage.employee;
      }
    });
  }


  goBack() {
    this.notification.closeModal();

  }

  openGalery(){
    console.log('open galery');
  }

  

}
