import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Employee } from '../models/employee';
import { NAME, USERNAME, ROUTE_CONTROL_ACCESS, UNLOCK_REQUESTED, CATEGORY, PHONE, EMAIL, CENTRE_ID } from '../app.constants';
import { BehaviorSubject, Observable } from 'rxjs';


import { CookieService } from 'ngx-cookie-service';
import { UserActivityService } from './user-activity.service';
import { StoredEmployee } from '../models/stored_employee';



@Injectable({
  providedIn: 'root'
})
export class StorageService {
  employeeBd: Storage = null;
  employee: Employee;
  actualToken: string;
  center: any = {};

  // Control employee account
  isValidate = false;
  isValid = false;

  // listener data user
  employeeListener: BehaviorSubject<any>;
  public readonly token: Observable<any>;
  public user: Observable<Employee>;
  currentUserListener: BehaviorSubject<Employee>;

  constructor(private storage: Storage, private userActivityService: UserActivityService) {
    this.init();
    this.employeeListener = new BehaviorSubject(this.actualToken);
    this.token = this.employeeListener.asObservable();
    this.currentUserListener = new BehaviorSubject(this.employee);
    this.user = this.currentUserListener.asObservable();

  }

  /**
   * Init storage
   */
  async init() {
    const storage = await this.storage.create();
    this.employeeBd = storage;
  }

  /**
   * Set new key and value in local bd
   *
   * @param key Key
   * @param value Value save
   */
  public async set(key: string, value: any) {
    await this.employeeBd?.set(key, value);
  }

  /**
   * Get Value bd Local
   *
   * @param key key search bd
   * @returns Value
   */
  public async get(key: string) {
    const value = await this.employeeBd?.get(key);
    return value;
  }

  /**
     * Get all the registries saved in database and push them to an array
     *
     * @returns Collection keys
     */
  public async getAll():Promise<any> {
    var list = {}
    var promise = new Promise((resolve, reject) => {
      this.storage.forEach((value, key, index) => {
        list[key] = value;
      }).then((d) => {
        resolve(list);
      });
    });
    return promise;
  }
  


  /**
   * Define el usuario a su servicio de control
   *
   * @param data Empleado que accede
   */
  async setUser(data: any, token:string) {
    // Se establecen los datos del empleado
    // en el servicio dedicado
    this.employee = data;
    this.set(ROUTE_CONTROL_ACCESS, 1);
    this.set(UNLOCK_REQUESTED, false);

    // Se comprueban y actualizan los datos en
    // caso necesario.
    this.updateEmployeeData().then(res => {
      console.log(res);
      console.log(this.employee);
      if (res !== undefined) {
        if (res.category !== this.employee.category) {
          this.set(CATEGORY, this.employee.category);
        }
        if (res.centre_id !== this.employee.centre_id) {
          this.set(CENTRE_ID, this.employee.centre_id);
        }
        if (res.name !== this.employee.name) {
          this.set(NAME, this.employee.name);
        }
        if (res.username !== this.employee.username) {
          this.set(USERNAME, this.employee.username);
        }
        if (res.phone !== this.employee.phone) {
          this.set(PHONE, this.employee.phone);
        }
        if (res.email !== this.employee.email) {
          this.set(EMAIL, this.employee.email);
        }
      } else {
        this.set(NAME, this.employee.name);
        this.set(USERNAME, this.employee.username);
        this.set(CATEGORY, this.employee.category);
        this.set(PHONE, this.employee.phone);
        this.set(EMAIL, this.employee.email);
        this.set(CENTRE_ID, this.employee.centre_id);
      }
    });
console.log(token);
    this.actualToken = token;
    // this.setToken(this.actualToken);
    this.userActivityService.login(this.actualToken);
    this.saveCurrentToken(this.actualToken);
    this.saveCurrentUser(this.employee);
  }



  saveCurrentToken(token): void {
    this.employeeListener.next(token);
  }

  saveCurrentUser (employee: Employee) {
    return this.currentUserListener.next(employee);
  }

  getCurrentUser(): Employee {
    return this.currentUserListener.getValue();

  }

  /**
   * Actualizacion de datos locales guardados
   * en dispositivo
   *
   * @returns Objeto de datos
   */
  async updateEmployeeData() {
    let employeeData: any;
    employeeData = {};
    await this.get(CATEGORY).then((val) => {
      employeeData.category = val;
    });
    await this.get(NAME).then((val) => {
      employeeData.name = val;
    });
    await this.get(USERNAME).then((value) => {
      employeeData.username = value;
    });
    await this.get(PHONE).then((value) => {
      employeeData.phone = value;
    });
    await this.get(EMAIL).then((value) => {
      employeeData.email = value;
    });
    return employeeData;
  }

  /**
   * Crea un objecto de tipo
   *
   * @param center
   * @returns Center object
   */
  async createCenter(data: any) {
    if (data !== undefined && data.centres !== undefined) {
      this.center.centre = data.centres[0].centre;
      this.center.centre_address = data.centres[0].centre_address;
      this.center.centre_phone = data.centres[0].centre_phone;
      this.center.centre_email = data.centres[0].centre_email;
      this.center.timetable = data.centres[0].timetable;
      this.center.island = data.centres[0].island;
      this.center.supervisor = data.supervisor;
      this.center.image = data.centres[0].image;
      return this.center;
    }
  }

  /**
   * Get the current size/length of this database
   *
   * @returns Count
   */
  public async count() {
    return await this.employeeBd?.length();
  }

  /**
   * Delete info
   *
   * @returns Status operation
   */
  async delete(key: string) {
    try {
      await this.employeeBd?.remove(key);
      return true;
    } catch (ex) {
      return false;
    }
  }

  async clearStorage() {
    await this.employeeBd?.clear();
  }


}
