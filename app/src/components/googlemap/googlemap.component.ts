import {Component, Input, ChangeDetectorRef} from '@angular/core';

import {Observable, Observer, Subject} from "rxjs";

// import {GoogleMapLoaderService} from '../common/google_maps_loader.service';
import {GoogleMapModelService} from '../common/google_maps_model.service';
import {WeatherModelService} from '../common/weather_model.service';
import {MarkersService} from '../common/markers.service';

import {template} from './googlemap.tpl';

@Component({
  selector: 'googlemap',
  template: template
  // providers: [ GoogleMapModelService ]
})
export class GooglemapComponent {
  @Input() location: ILocation.ICoordinates;
  @Input() zoom: number = 1;

  // key: string = 'AIzaSyDdauxpzXTyktNa8x97awm9_3X-3pycINA';
  selector: string = 'googlemap';

  townsTable: Weather.ITownWeather[];

  townsWeatherSource: Observable<Weather.ITownWeather[]>;
  townsWeatherObserver: () => Observer<Weather.ITownWeather[]>;

  // googleMapObj: google.maps.Map;
  // inLoading: boolean;
  markerArray: NGoogleMapService.IMarkerPoint[];
  markerArrayDetach: any[];

  currentPositionSource: Subject<google.maps.LatLng>;
  currentPosition$: Observable<google.maps.LatLng>;

  constructor(
              // private googleMapLoaderService: GoogleMapLoaderService,
              private cd: ChangeDetectorRef,
              private weatherModelService: WeatherModelService,
              private markersService: MarkersService,
              private googleMapModelService: GoogleMapModelService
  ) {
    console.log('GooglemapComponent init.');
    // this.inLoading = true;
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
        // if (!this.inLoading) {
          this.googleMapModelService.updateMarkers(this.markerArray);
        // }
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
    // this.initMap(this.location);
    this.googleMapModelService.initMap(this.location, this.zoom, this.selector);
  }

  // getRxCurrentPosition(): Observable<google.maps.LatLng> {
  //   return this.currentPosition$;
  // }

  // setMapCenterAndZoom(lat: number, lng: number, zoom: number) {
  //   let mapOptions: google.maps.MapOptions = {
  //     center: {
  //       lat: lat,
  //       lng: lng
  //     },
  //     zoom: zoom
  //   };
  //   this.googleMapObj.setOptions(mapOptions);
  // }
  //
  // updateMarkers() {
  //   this.googleMapModelService.deleteMarkers();
  //   this.googleMapModelService.setMarkers(this.markerArray);
  // }

  // deleteMarkers() {
  //   this.markerArrayDetach.forEach((value)=>{
  //     value.setMap(null);
  //   });
  //   this.markerArrayDetach = [];
  // }

  // setMarkers(markerSetArray: NGoogleMapService.IMarkerPoint[]) {
  //   this.googleMapModelService.setMarkers(markerSetArray);
  //   // this.markerArray = markerSetArray;
  //   // markerSetArray.forEach((value: NGoogleMapService.IMarkerPoint) => {
  //   //   this.markerArrayDetach.push(
  //   //     new google.maps.Marker({
  //   //       position: {lat: value.lat, lng: value.lng},
  //   //       map: this.googleMapObj,
  //   //       title: value.text
  //   //     })
  //   //   );
  //   // });
  // }

  // private initMap(location: ILocation.ICoordinates) {
  //   this.googleMapLoaderService.load({key: this.key}).then((googleMaps: any) => {
  //     // noinspection TsLint
  //     this.googleMapObj = new googleMaps.Map(document.getElementById('googlemap'), {
  //       center: {lat: location.latitude, lng: location.longitude},
  //       zoom: this.zoom
  //     });
  //     this.inLoading = false;
  //     if (this.markerArray.length > 0) {
  //       this.updateMarkers();
  //     }
  //     // listener for current position on the map and pushh it to stream
  //     this.googleMapObj.addListener('drag', () => {
  //       let latLng: google.maps.LatLng = this.googleMapObj.getCenter();
  //       this.currentPositionSource.next(latLng);
  //     });
  //   }).catch((err: Object) => {
  //     console.error(err);
  //     alert('Cann\'t load google map!');
  //   });
  // }

}
