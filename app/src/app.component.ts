import {Component, ChangeDetectorRef} from '@angular/core';

import { template } from './app.tpl';
import {LocationService} from './components/common/location.service';

@Component({
  selector: 'my-app',
  template: template
})
export class AppComponent  {
  // Here you define how many town will be shown.
  amountTowns: string = '5';
  zoom: number = 8;
  enableChild: boolean = false;
  coordinates: ILocation.ICoordinates;

  constructor(private locationService: LocationService,
              private cd: ChangeDetectorRef
  ) {
    this.locationService.getCurrentLocation().then(
      (coordinate: ILocation.ICoordinates) => {
        this.coordinates = coordinate;
      },
      () => {
        console.log('Cann\'t get coordinates. Load default (31,32).');
        alert('Cann\'t get coordinates. Load default (31,32).');
        this.coordinates = {
          longitude: 32,
          latitude: 31
        };
      }
    ).then( () => {
      this.cd.detectChanges();
      this.enableChild = true;
    });
  }

  // updateLastTime(time: number): void {
  //
  // }
}
