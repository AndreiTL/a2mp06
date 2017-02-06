declare namespace NGoogleMapService {
  export interface IMarkerPoint {
    lng: number;
    lat: number;
    name?: string;
    text: string;
  }

  export interface IGoogleMapOptions {
    lng: number;
    lat: number;
    zoom: number;
  }
}
