/**
 * Modelo para Servicios
 */

import { Centre } from "./centre";

export interface Service {
  id: number;
  name: string;
  description: string;
  url: string;
  image: string;
  fecha: Date;
  price: string;
  centers: Array <Centre>;
}
