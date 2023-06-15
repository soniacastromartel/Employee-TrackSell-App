import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class AccessToService {

  /**
   * Informacion de dispositivo
   */
  deviceInfo = {
    modelo: undefined,
    uuid: undefined,
    version: undefined,
    fabricante: undefined,
    os: undefined
  };

  constructor(private device: Device,
              private storage: StorageService){}

  /**
   * Get info Device
   *
   * @returns info device
   */
  async getUuid(){
    this.deviceInfo.modelo = this.device.model;
    this.deviceInfo.uuid = this.device.uuid;
    this.deviceInfo.version = this.device.version;
    this.deviceInfo.fabricante = this.device.manufacturer;
    this.deviceInfo.os = this.device.platform;
    return this.deviceInfo;
  }

  /**
   * Se encarga de reestablecer los campos base
   * para el bloqueo del usuario
   */
  async userBlock(){
    this.storage.actualToken = undefined;
    this.storage.employee = undefined;
    this.storage.center = undefined;
    this.storage.isValid = false;
  }

}
