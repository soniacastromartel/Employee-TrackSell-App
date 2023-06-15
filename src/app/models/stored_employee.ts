import { Centre } from './centre';
/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Modelo para Objeto Empleado en Local Storage
 */
export interface StoredEmployee {
    category: string;
    centers: Centre[];
    email: string;
    name: string;
    phone: string;
    privacy: boolean;
    routeAccess: number;
    unlockRequest: boolean;
    username: string;

}