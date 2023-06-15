import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToArray'
})
export class StringToArrayPipe implements PipeTransform {

  transform(value: string): string {
    // Convert the string to an array
    const array = value.split(' ');

    // Check if the array has at least two elements
    if (array.length >= 2) {
      // Get the first two elements of the array
      const newArray = array.slice(0, 3);

      // Join the elements of the new array into a string
      const newString = newArray.join(' ');

      return newString;
    }

    // Return the original value if there are fewer than two elements
    return value;
  }

}
