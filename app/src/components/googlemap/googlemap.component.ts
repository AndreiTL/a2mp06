import {Component, Input} from '@angular/core';
import {template} from './googlemap.tpl';

import {GoogleMapLoaderService} from '../common/google_maps_loader.service';
import {WeatherModelService} from '../common/weather_model.service';
import {MarkersService} from '../common/markers.service';

@Component({
  selector: 'googlemap',
  template: template,
  providers: [ GoogleMapLoaderService ]
})
export class GooglemapComponent {
  @Input() location: ILocation.ICoordinates;
  @Input() zoom: number = 1;

  key: string = 'AIzaSyDdauxpzXTyktNa8x97awm9_3X-3pycINA';

  googleMapObj: google.maps.Map;
  inLoading: boolean;
  markerArray: NGoogleMapService.IMarkerPoint[];

  constructor(private googleMapLoaderService: GoogleMapLoaderService,
              // private zone: NgZone,
              private weatherModelService: WeatherModelService,
              private markersService: MarkersService
  ) {
    console.log('GooglemapComponent init.');
    this.inLoading = true;
    this.markerArray = [];
    weatherModelService.addListener(this.updateView.bind(this));
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

  setMarkers(markerSetArray: NGoogleMapService.IMarkerPoint[]) {
    this.markerArray = markerSetArray;
    markerSetArray.forEach((value: NGoogleMapService.IMarkerPoint) => {
      new google.maps.Marker({
        position: {lat: value.lat, lng: value.lng},
        map: this.googleMapObj,
        title: value.text
      });
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
        this.setMarkers(this.markerArray);
      }
    }).catch((err: Object) => {
      console.error(err);
      alert('Cann\'t load google map!');
    });
  }

  updateView(): void {
    this.markerArray = this.markersService.processMarkers(this.weatherModelService.getTownsWeather());
    if (!this.inLoading) {
      this.setMarkers(this.markerArray);
    } // else do nothing
  }
}
