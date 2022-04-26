import { Service } from './service';
/**
 * Modelo para la Categoria de servicios
 */
export interface CategoryService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  image_portrait: string;
  image: string;
  name: string;
  description: string;
  services: Array<Service>;
  }
