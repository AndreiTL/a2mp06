import {Injectable} from '@angular/core';
@Injectable()
export class MarkersService {
  processMarkers(array: Weather.ITownWeather[]): NGoogleMapService.IMarkerPoint[] {
    let sampleArray: NGoogleMapService.IMarkerPoint[] = [];
    array.forEach((value) => {
      // townTableTemp = context.townTableTemp.concat(context.generateTableRow(value));
      sampleArray.push({
        lng: value.coord.lon,
        lat: value.coord.lat,
        text: value.name + ': ' + String(Math.round((value.main.temp - 273.15) * 10) / 10),
        name: value.name
      });
    });
    return sampleArray;
  }
}
