declare namespace Weather {
  export interface ICoordinate {
    lon: number;
    lat: number;
  }
  export interface IMainWeather {
    temp: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  }
  export interface IWind {
    speed: number;
    deg: number;
  }
  export interface ISys {
    country: string;
  }
  export interface IClouds {
    all: number;
  }
  export interface IWeather {
    id: number;
    main: string;
    description: string;
    icon: string;
  }
  export interface ITownWeather {
    id: number;
    name: string;
    coord: ICoordinate;
    main: IMainWeather;
    dt: number;
    wind: IWind;
    sys: ISys;
    clouds: IClouds;
    weather: IWeather[];
  }
  export interface IWeatherObject {
    message: string;
    cod: number;
    count: number;
    list: ITownWeather[];
  }
  export interface IWeatherParams {
    longitude: number;
    latitude: number;
    count: number;
  }
}
