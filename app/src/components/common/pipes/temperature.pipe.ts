import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'temperatureCelciumPipe'})
export class TemperatureCelciumPipe implements PipeTransform {
  transform(kelvin: number): number {
    return Math.round((kelvin - 273.15) * 10) / 10;
  }
}
