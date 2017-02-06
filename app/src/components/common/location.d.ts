declare namespace ILocation {
  export function getCurrentLocation(
  ): Promise<ILocation.ICoordinates>;

  export interface ICoordinates {
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    latitude: number;
    longitude: number;
    speed?: number;
  }
}
