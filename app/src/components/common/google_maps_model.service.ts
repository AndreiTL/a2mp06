import {Injectable} from '@angular/core';

import {Observable, Subject} from "rxjs";

import {GoogleMapLoaderService} from './google_maps_loader.service';

@Injectable()
export class GoogleMapModelService {

  key: string = 'AIzaSyDdauxpzXTyktNa8x97awm9_3X-3pycINA';

  googleMapObj: google.maps.Map;
  inLoading: boolean;
  markerArray: NGoogleMapService.IMarkerPoint[];
  markerArrayDetach: any[];

  currentPositionSource: Subject<ILocation.ISimpleCoordinate>;
  currentPosition$: Observable<ILocation.ISimpleCoordinate>;

  constructor(
    private googleMapLoaderService: GoogleMapLoaderService,
  ) {
    this.inLoading = true;
    this.markerArrayDetach = [];
    this.markerArray = [];

    // map current position stream and listener
    this.currentPositionSource = new Subject<ILocation.ISimpleCoordinate>();
    this.currentPositionSource.next({lat: 0, lng: 0});
    this.currentPosition$ = this.currentPositionSource.asObservable();

  }

  getRxCurrentPosition(): Observable<ILocation.ISimpleCoordinate> {
    return this.currentPosition$;
    // return this.currentPositionSource;
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

  updateMarkers(markerSetArray: NGoogleMapService.IMarkerPoint[]) {
    this.deleteMarkers();
    this.setMarkers(markerSetArray);
  }

  deleteMarkers() {
    this.markerArrayDetach.forEach((value)=>{
      value.setMap(null);
    });
    this.markerArrayDetach = [];
  }

  setMarkers(markerSetArray: NGoogleMapService.IMarkerPoint[]) {
    this.markerArray = markerSetArray;
    if (!this.inLoading) {
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
  }

  initMap(location: ILocation.ICoordinates, zoom: number, selector: string) {
    this.googleMapLoaderService.load({key: this.key}).then((googleMaps: any) => {
      // noinspection TsLint
      this.googleMapObj = new googleMaps.Map(document.getElementById(selector), {
        center: {lat: location.latitude, lng: location.longitude},
        zoom: zoom
      });
      this.inLoading = false;
      if (this.markerArray.length > 0) {
        this.updateMarkers(this.markerArray);
      }
      // function listener
      let handleCoordinate = (): void => {
        let latLng: google.maps.LatLng = this.googleMapObj.getCenter();
        this.currentPositionSource.next({lat: latLng.lat(), lng: latLng.lng()});
        // console.log({lat: latLng.lat(), lng: latLng.lng()});
        // console.log(this);
      };
      // listener for current position on the map and push it to stream
      this.googleMapObj.addListener('drag', handleCoordinate);
    }).catch((err: Object) => {
      console.error(err);
      alert('Cann\'t load google map!');
    });
  }
}
