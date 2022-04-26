import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe de transformacion para acortar texto
 */

@Pipe({
  name: 'sliceLargeText'
})
// Acortador de texto largo
export class SliceLargeTextPipe implements PipeTransform {
  transform(value: string, min: number, max: number, ): string {
    if (value !== undefined && value.length > max){
      return value.slice(0, min) + '..';
    } else{
      return value;
    }
  }

}
