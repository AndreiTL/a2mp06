import {Component, Input, NgZone, ChangeDetectionStrategy} from '@angular/core';
import {template} from './header.tpl';
import {WeatherModelService} from '../common/weather_model.service';

@Component({
  selector: 'my-header',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() location: ILocation.ICoordinates;
  lastUpddateTime: number;

  constructor(
    private weatherModelService: WeatherModelService,
    private zone: NgZone
  ) {
    weatherModelService.addListener(this.updateView.bind(this));
    this.lastUpddateTime = weatherModelService.getLastUpdateTime() || 0;
  }

  updateView(): void {
    // console.log('header zone run');
    this.lastUpddateTime = this.weatherModelService.getLastUpdateTime();
    this.zone.run(() => {});
  }

}
