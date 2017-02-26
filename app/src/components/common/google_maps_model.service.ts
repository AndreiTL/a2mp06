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

  currentPositionSource: Subject<google.maps.LatLng>;
  currentPosition$: Observable<google.maps.LatLng>;

  constructor(
    private googleMapLoaderService: GoogleMapLoaderService,
  ) {
    this.inLoading = true;
    this.markerArrayDetach = [];
    this.markerArray = [];
  }

  getRxCurrentPosition(): Observable<google.maps.LatLng> {
    return this.currentPosition$;
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
      // listener for current position on the map and pushh it to stream
      this.googleMapObj.addListener('drag', () => {
        let latLng: google.maps.LatLng = this.googleMapObj.getCenter();
        this.currentPositionSource.next(latLng);
      });
    }).catch((err: Object) => {
      console.error(err);
      alert('Cann\'t load google map!');
    });
  }
}
