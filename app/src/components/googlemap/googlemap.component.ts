import {Component, Input, ChangeDetectorRef} from '@angular/core';

import {Observable, Observer} from "rxjs";

import {GoogleMapLoaderService} from '../common/google_maps_loader.service';
import {WeatherModelService} from '../common/weather_model.service';
import {MarkersService} from '../common/markers.service';

import {template} from './googlemap.tpl';

@Component({
  selector: 'googlemap',
  template: template,
  providers: [ GoogleMapLoaderService ]
})
export class GooglemapComponent {
  @Input() location: ILocation.ICoordinates;
  @Input() zoom: number = 1;

  key: string = 'AIzaSyDdauxpzXTyktNa8x97awm9_3X-3pycINA';

  townsTable: Weather.ITownWeather[] ;

  townsWeatherSource: Observable<Weather.ITownWeather[]>;
  townsWeatherObserver: () => Observer<Weather.ITownWeather[]>;


  googleMapObj: google.maps.Map;
  inLoading: boolean;
  markerArray: NGoogleMapService.IMarkerPoint[];
  markerArrayDetach: any[];

  constructor(private googleMapLoaderService: GoogleMapLoaderService,
              private cd: ChangeDetectorRef,
              private weatherModelService: WeatherModelService,
              private markersService: MarkersService
  ) {
    console.log('GooglemapComponent init.');
    this.inLoading = true;
    this.markerArrayDetach = [];

    this.markerArray = [];
    this.townsTable = [];

    this.townsWeatherSource = this.weatherModelService.getRxTownsWeather();

    this.townsWeatherObserver = () => {return {
      next: value => {
        console.log('next googlemp');
        console.dir(value);
        this.townsTable = value;
        this.markerArray = this.markersService.processMarkers(this.townsTable);
        if (!this.inLoading) {
          this.updateMarkers();
        }
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
    this.initMap(this.location);
  }

  setMapCenterAndZoom(lat: number, lng: number, zoom: number) {
    let mapOptions: google.maps.MapOptions = {
      center: {
        lat: lat,
        lng: lng
      },
      zoom: zoom
    };
    this.googleMapObj.setOptions(mapOptions);
  }

  updateMarkers() {
    this.deleteMarkers();
    this.setMarkers(this.markerArray);
  }

  deleteMarkers() {
    this.markerArrayDetach.forEach((value)=>{
      value.setMap(null);
    });
    this.markerArrayDetach = [];
  }

  setMarkers(markerSetArray: NGoogleMapService.IMarkerPoint[]) {
    this.markerArray = markerSetArray;
    markerSetArray.forEach((value: NGoogleMapService.IMarkerPoint) => {
      this.markerArrayDetach.push(
        new google.maps.Marker({
          position: {lat: value.lat, lng: value.lng},
          map: this.googleMapObj,
          title: value.text
        })
      );
    });
  }

  initMap(location: ILocation.ICoordinates) {
    this.googleMapLoaderService.load({key: this.key}).then((googleMaps: any) => {
      // noinspection TsLint
      this.googleMapObj = new googleMaps.Map(document.getElementById('googlemap'), {
        center: {lat: location.latitude, lng: location.longitude},
        zoom: this.zoom
      });
      this.inLoading = false;
      if (this.markerArray.length > 0) {
        this.updateMarkers();
      }
    }).catch((err: Object) => {
      console.error(err);
      alert('Cann\'t load google map!');
    });
  }

}
