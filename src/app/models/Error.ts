/**
 * Modelo para Errores ocurridos
 */

export interface Error{
  phone: number;
  uuid: string;
  model: string;
  version: number;
  fabricante: string;
  screen: string;
  error: string;
  fecha: string;
}
