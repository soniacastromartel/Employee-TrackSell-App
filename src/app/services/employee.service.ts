import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Employee } from '../models/employee';
import { DNI, NAME, USERNAME, ROUTE_CONTROL_ACCESS, ENCRIPTING_KEY, UNLOCK_REQUESTED } from '../app.constants';
import { BehaviorSubject, Observable } from 'rxjs';

//import * as CryptoJS from 'crypto-js';

// TODO: JDCR
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
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
  // currentUserListener: BehaviorSubject<Employee>;
  // public readonly currentUser: Observable<Employee>;

  constructor(private storage: Storage, private cookies: CookieService) {
    this.init();
    this.employeeListener = new BehaviorSubject(this.actualToken);
    this.token = this.employeeListener.asObservable();
    // this.currentUserListener= new BehaviorSubject (this.employee);
    // this.currentUser= this.currentUserListener.asObservable();
  }

  /**
   * Define el usuario a su servicio de control
   *
   * @param data Empleado que accede
   */
  async setUser(data: any) {
    // Se establecen los datos del empleado
    // en el servicio dedicado
    this.employee = data.data.user;
    this.set(ROUTE_CONTROL_ACCESS, 1);
    this.set(UNLOCK_REQUESTED, false);

    // Se comprueban y actualizan los datos en
    // caso necesario.
    this.updateEmployeeData().then(res => {
      if (res !== undefined) {
        if (res.dni !== this.employee.dni) {
          //this.set(DNI, CryptoJS.AES.encrypt(this.employee.dni, ENCRIPTING_KEY).toString());
          this.set(DNI, this.employee.dni);
        }
        if (res.name !== this.employee.name) {
          this.set(NAME, this.employee.name);
        }
        if (res.username !== this.employee.username) {
          this.set(USERNAME, this.employee.username);
        }
      } else {
        this.set(DNI, this.employee.dni);
        this.set(NAME, this.employee.name);
        this.set(USERNAME, this.employee.username);
      }
    });

    this.actualToken = data.data.access_token;
    this.setToken(this.actualToken);
    this.saveCurrentToken(this.actualToken);
    // this.saveCurrentUser(this.employee);
  }



  saveCurrentToken(token): void {
    this.employeeListener.next(token);
  }

  // saveCurrentUser(user: Employee): void {
  //   this.employeeListener.next(user);
  // }

  // getCurrentUser(): Employee {
  //   return this.currentUserListener.getValue();

  // }

  /**
   * Actualizacion de datos locales guardados
   * en dispositivo
   *
   * @returns Objeto de datos
   */
  async updateEmployeeData() {
    let employeeData: any;
    await this.get(DNI).then((val) => {
      employeeData = {};
      employeeData.dni = val;
    });
    await this.get(NAME).then((val) => {
      employeeData.name = val;
    });
    await this.get(USERNAME).then((value) => {
      employeeData.username = value;
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
  public getAll() {
    const collection = [];
    this.employeeBd.forEach(value => {
      collection.push(value);
      console.log(value);
    });
    return collection;
  }

  /**
   * Get the current size/length of this database
   *
   * @returns Count
   */
  public count() {
    return this.employeeBd?.length();
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
      console.log(ex);
      return false;
    }
  }


  async clearStorage() {
    await this.employeeBd?.clear();
  }

  setToken(token: string) {
    this.cookies.set("token", token);
  }

  getToken() {
    return this.cookies.get("token");
  }

  deleteToken() {
    return this.cookies.delete("token");
  }

}
