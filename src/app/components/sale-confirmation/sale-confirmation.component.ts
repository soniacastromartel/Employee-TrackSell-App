import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { PageService } from '../../services/page.service';
import { INFO_ACEPTACION_PACIENTE, BASE_URL } from '../../app.constants';

@Component({
  selector: 'app-sale-confirmation',
  templateUrl: './sale-confirmation.component.html',
  styleUrls: ['./sale-confirmation.component.scss'],
})
export class SaleConfirmationComponent implements OnInit {

  // Datos de venta a confirmar
  venta = {
    employee: undefined,
    service: undefined,
    cRealizador: undefined,
    cEmployee: undefined,
    cantidad: undefined,
    portada: undefined,
    pacienteId: undefined,
    pacienteName: undefined,
    fecha: undefined,
    observaciones: undefined,
    discount: undefined
  };

  // Var de control confirmacion
  confirm: boolean;

  // Texto aceptacion cliente checkbox
  infoAceptacion = INFO_ACEPTACION_PACIENTE;

  constructor(private params: NavParams, private pageSvc: PageService) { }

  ngOnInit() {
    // Recogida de datos de venta
    const data = this.params.get('data');
    if (data !== undefined) {
    this.venta.employee = data.employee;
    this.venta.cRealizador = data.cRealizador;
    this.venta.service = data.service;
    this.venta.cEmployee = data.cEmployee;
    this.venta.cantidad = data.cantidad;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data.portada === undefined ?
      this.venta.portada = BASE_URL + data.service.category_image_port:
      this.venta.portada = data.portada;
    this.venta.pacienteId = data.pacienteId;
    this.venta.pacienteName = data.pacienteName;
    this.venta.fecha = data.fecha;
    this.venta.observaciones = data.observaciones;
    this.venta.discount = data.discount;
    }
  }

  // Reaccion botones accion [CANCELAR/CONFIRMAR]
  actionSale(isValid: boolean) {
    this.pageSvc.closeModal(isValid);
  }

}
