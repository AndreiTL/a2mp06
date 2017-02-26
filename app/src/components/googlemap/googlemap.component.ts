import {Component, Input, ChangeDetectorRef} from '@angular/core';

import {Observable, Observer, Subject} from "rxjs";

import {GoogleMapModelService} from '../common/google_maps_model.service';
import {WeatherModelService} from '../common/weather_model.service';
import {MarkersService} from '../common/markers.service';

import {template} from './googlemap.tpl';

@Component({
  selector: 'googlemap',
  template: template
})
export class GooglemapComponent {
  @Input() location: ILocation.ICoordinates;
  @Input() zoom: number = 1;

  selector: string = 'googlemap';

  townsTable: Weather.ITownWeather[];

  townsWeatherSource: Observable<Weather.ITownWeather[]>;
  townsWeatherObserver: () => Observer<Weather.ITownWeather[]>;

  markerArray: NGoogleMapService.IMarkerPoint[];
  markerArrayDetach: any[];

  currentPositionSource: Subject<google.maps.LatLng>;
  currentPosition$: Observable<google.maps.LatLng>;

  constructor(
              private cd: ChangeDetectorRef,
              private weatherModelService: WeatherModelService,
              private markersService: MarkersService,
              private googleMapModelService: GoogleMapModelService
  ) {
    console.log('GooglemapComponent init.');
    this.markerArrayDetach = [];

    this.markerArray = [];
    this.townsTable = [];

    this.townsWeatherSource = this.weatherModelService.getRxTownsWeather();

    // map current position stream and listener
    this.currentPositionSource = new Subject<google.maps.LatLng>();
    this.currentPosition$ = this.currentPositionSource.asObservable();

    // get towns weather
    this.townsWeatherObserver = () => {return {
      next: value => {
        console.log('next googlemp');
        console.dir(value);
        this.townsTable = value;
        this.markerArray = this.markersService.processMarkers(this.townsTable);
        this.googleMapModelService.updateMarkers(this.markerArray);
        this.cd.detectChanges();
      },
      error: err => {
        console.log('err googlemp');
        console.dir(err);
      },
      complete: () => {
        console.log('comlete thread googlemp');
      }
    }};
    this.townsWeatherSource.subscribe(this.townsWeatherObserver());
  }

  ngAfterContentInit() {
    this.googleMapModelService.initMap(this.location, this.zoom, this.selector);
  }

}
