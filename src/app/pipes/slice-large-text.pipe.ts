import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe de transformacion para acortar texto
 */

@Pipe({
  name: 'sliceLargeText'
})
// Acortador de texto largo
export class SliceLargeTextPipe implements PipeTransform {
  transform(value: string, max: number, ): string {
    if (value !== undefined && value.length > max){
      return value.slice(0, max) + '...';
    } else{
      return value;
    }
  }

}
