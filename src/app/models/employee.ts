import { Centre } from './centre';
/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Modelo para Empleados
 */
export interface Employee {
  id: number;
  name: string;
  username: string;
  dni: string;
  phone: number;
  email: string;
  centre_id: number;
  centreAux: Centre[];
  category: number;
  validated: number;
  pending_password: string;
  img: string;
}

