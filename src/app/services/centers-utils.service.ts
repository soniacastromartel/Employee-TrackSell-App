/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { DatacheckService } from './datacheck.service';
import { Subscription } from 'rxjs';
import { Centre } from '../models/centre';

@Injectable({
  providedIn: 'root'
})
export class CentersUtilsService {

  /**
   * Centros disponibles
   */
  centers: Centre[]= undefined;

  // Subcription control
  centersSubcription: Subscription;

  constructor(private employeeSvc: EmployeeService, private dataCheck: DatacheckService) { }

  /***
   * Comprobacion centros en local
   */
  async localCenters(){
    if (this.centers === undefined){
      this.employeeSvc.employeeBd.get('centers').then(async (res) => {
      if(res == null){
        await this.getCenterOfSystem();
      } else{
        this.centers = res;
        return true;
      }
    }).catch(ex => false);
    }
  }

  /**
   * Recogida centros sistema
   */
async getCenterOfSystem(){
    await this.dataCheck.getCenters().then(res => {
    this.centersSubcription = res.subscribe((listCenters: any)=>{
      if (listCenters !== undefined){
        this.centers = listCenters.data;
        this.employeeSvc.employeeBd.set('centers', this.centers);
        return true;
      }
    });
  }).catch(ex => false);
}

/**
 * Método auxiliar
 *
 * @returns objeto base de tipo CENTRE
 */
    async centerDefault(){
      return {
        id: -1,
        centre: '',
        centre_address: ' ',
        centre_email: '',
        centre_phone:0 ,
        timetable: '',
        island: '',
        supervisor: ''
    };
  }
}
