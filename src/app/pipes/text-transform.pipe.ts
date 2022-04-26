import { Pipe, PipeTransform } from '@angular/core';
import { IDENTIFICATION_LABELS } from '../app.constants';


/**
 * Transformacion de texto en type
 * identificacion paciente
 */

@Pipe({
  name: 'textTransform'
})
// Pipe de transformacion para la identificacion del paciente
// en el registro de venta
export class TextTransformPipe implements PipeTransform {

  transform(text: string): string {
    let aux= '';
    switch(text){
      case 'hc':
        aux = IDENTIFICATION_LABELS[0];
        break;
      case 'phone':
        aux = IDENTIFICATION_LABELS[1];
        break;
      case 'dni':
        aux = IDENTIFICATION_LABELS[2];
        break;
    }
    return aux;
  }

}
