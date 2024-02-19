import { Centre } from './centre';
import { Service } from './service';
/**
 * Modelo para la Categoria de servicios
 */
export interface CategoryService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id: number;
  name: string;
  image: string;
  description: string;
  image_portrait: string;
  cancellation_date: Date;
  services: Array<Service>;
}
