import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {RestService} from './rest.service';
import {BehaviorSubject, Subject} from 'rxjs'

@Injectable()
export class WeatherModelService {

  callFunctionsArray: Function[];
  weatherObject: Weather.IWeatherObject;

  // 10 minutes
  maxTimeValide: number = 10 * 60 * 1000;

  API: string = `94c7919f6854ca11558382472a998f8f`;

  typeRequest: string = 'GET';
  async: boolean = true;

  latitude: number = 0;
  longitude: number = 0;
  count: number = 1;

  lastUpdateTime: number;

  private townsWeather: Weather.ITownWeather[];

  private subjectWeather: Subject<Weather.IWeatherObject>;
  private subjectTownsWeather: Subject<Weather.ITownWeather[]>;
  private subjectUpdateTime: Subject<number>;

  constructor(private storageService: StorageService,
          private restService: RestService
  ) {
    this.townsWeather = [];
    this.callFunctionsArray = [];
    this.subjectWeather = new Subject();
    this.subjectTownsWeather = new Subject();
    this.subjectUpdateTime = new Subject();

    let locStorLastUpdateTime: number = parseInt(this.storageService.getData('lastUpdateTime'), 10);
    if (locStorLastUpdateTime) {
      this.subjectUpdateTime.next(locStorLastUpdateTime);
    }
  }

  getRxWeatherObject(): Subject<Weather.IWeatherObject> {
    return this.subjectWeather;
  }

  getRxTownsWeather(): Subject<Weather.ITownWeather[]> {
    return this.subjectTownsWeather;
  }

  addTownById(id: number): void {
    this.loadWeatherByIds([id]).then(
      (weather: Weather.IWeatherObject) => {
        if (weather && weather.list && weather.list.length > 0) {
          // this.townsWeather = this.townsWeather.concat(weather.list);
          this.townsWeather.push(weather.list[0]);
          this.subjectTownsWeather.next(this.townsWeather);
        } else {
          this.subjectTownsWeather.error('Cann\'t load data from server');
        }
      }
    )
  }
  addTownByName(id: number): void {

  }
  removeTown(id: number): void {
    let indexRemove: number = this.townsWeather.findIndex((value: Weather.ITownWeather) => {
      console.log(value.id + ' ' + (value.id === id))
      return value.id === id;
    });
    if (indexRemove > -1) {
      this.townsWeather.splice(indexRemove, 1);
    }
    console.log(indexRemove);
    this.subjectTownsWeather.next(this.townsWeather);
  }

  loadWeatherInCircle(options: Weather.IWeatherParams): void {
    let lastUpdateTimeString: string = this.storageService.getData('lastUpdateTime');
    if (!lastUpdateTimeString) {
      // case: first load
      console.log('Nothing in storage. Load from internet.');
      this.initLoadInCircle(options);
    } else {
      // in milliseconds
      this.lastUpdateTime = parseInt(lastUpdateTimeString, 10);
      let paramsString: string = this.storageService.getData('params');
      let params: Weather.IWeatherParams = <Weather.IWeatherParams> JSON.parse(paramsString);
      if ((this.lastUpdateTime > (Date.now() - this.maxTimeValide)) &&
        params.latitude === options.latitude &&
        params.longitude === options.longitude &&
        params.count === options.count
      ) {
        // case: in storage are valid data then load from storage
        console.log('Valid in storage. Load from storage.');
        let townsString = this.storageService.getData('townsweather');
        this.townsWeather = <Weather.ITownWeather[]> JSON.parse(townsString);
        this.subjectTownsWeather.next(this.townsWeather);
      } else {
        // case: in storage are expired data then load from internet
        console.log('Expired or invalid in storage. Load from internet.');
        this.initLoadInCircle(options);
      }
    }
  }

  getRxLastUpdateTime(): Subject<number> {
    return this.subjectUpdateTime;
  }

  getLastUpdateTime(): number {
    return parseInt(this.storageService.getData('lastUpdateTime'), 10);
  }

  // getTownsWeather(): Weather.ITownWeather[] {
  //   return this.weatherObject.list;
  // }

  loadWeatherByIds(ids: number[]): Promise<Weather.IWeatherObject> {
    return new Promise((resolve, reject): void => {
      let weather: Weather.IWeatherObject;
      let idsStringBody: string = '';
      ids.map((value: number, index: number) => {
        if (index > 0){
          idsStringBody = idsStringBody.concat(',', value.toString());
        } else {
          idsStringBody = value.toString();
        }
      });

      let urlTemplate = `http://api.openweathermap.org/data/2.5/group?id=` +
        `${idsStringBody}&appid=${this.API}`;

      this.restService.sendRequest(this.typeRequest, urlTemplate, this.async, '').then(
        (responseText: string) => {
          weather = <Weather.IWeatherObject> JSON.parse(responseText);
          resolve(weather);
        },
        () => {
          console.log('Cann\'t load data from weather portal!');
          alert('Cann\'t load data from weather portal!');
          reject();
        }
      );
    });
  }

  //subject: Subject<Weather.IWeatherObject>
  private initLoadInCircle(options: Weather.IWeatherParams) {
    let weather: Weather.IWeatherObject;
    let urlTemplate = `http://api.openweathermap.org/data/2.5/find?lat=` +
      `${options.latitude}&lon=${options.longitude}&cnt=${options.count}&appid=${this.API}`;
    this.restService.sendRequest(this.typeRequest, urlTemplate, this.async, '').then(
      (responseText: string) => {
        weather = <Weather.IWeatherObject> JSON.parse(responseText);
        this.lastUpdateTime = Date.now();
        this.weatherObject = weather;
        // and when weather.cod===200
        if (weather && weather.list && weather.list.length > 0) {
          this.storageService.setData('lastUpdateTime', JSON.stringify(this.lastUpdateTime));
          this.storageService.setData('townsweather', JSON.stringify(this.weatherObject.list));
          this.storageService.setData('params', JSON.stringify({
            longitude: options.longitude,
            latitude: options.latitude,
            count: options.count})
          );
          this.townsWeather = weather.list;
          this.subjectTownsWeather.next(this.townsWeather);
        } else {
          this.subjectTownsWeather.error('Cann\'t load data from server');
        }
      },
      () => {
        this.subjectTownsWeather.error('Cann\'t load data from server');
      });
  }

  // to deliver changes to other components
  addListener(callFunction: Function) {
    this.callFunctionsArray.push(callFunction);
  }

  private callFunctionsInArray() {
    this.callFunctionsArray.forEach( (value: Function) => {
      value();
    });
  }

}
