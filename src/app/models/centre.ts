/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Modelo para Centros
 */

export interface Centre {
  id: number;
  centre: string;
  centre_phone: number;
  centre_email: string;
  centre_address: string;
  timetable: string;
  island: string;
  supervisor: string;
  image: string;
}
