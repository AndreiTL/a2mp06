import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {RestService} from './rest.service';
import {BehaviorSubject} from 'rxjs'
import IWeather = Weather.IWeather;
import IMainWeather = Weather.IMainWeather;

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

  private behaviorSubjectWeather: BehaviorSubject<Weather.IWeatherObject>;
  private behaviorSubjectUpdateTime: BehaviorSubject<number>;

  constructor(private storageService: StorageService,
          private restService: RestService
  ) {
    this.callFunctionsArray = [];
    this.behaviorSubjectWeather = new BehaviorSubject(<Weather.IWeatherObject>{});
    this.behaviorSubjectUpdateTime = new BehaviorSubject(0);

    let locStorLastUpdateTime: number = parseInt(this.storageService.getData('lastUpdateTime'), 10);
    if (locStorLastUpdateTime) {
      this.behaviorSubjectUpdateTime.next(locStorLastUpdateTime);
    }
  }

  // setWeatherParams(options: Weather.IWeatherParams) {
  //   this.longitude = options.longitude;
  //   this.latitude = options.latitude;
  //   this.count = options.count;
  // }

  getRxWeatherObject(): BehaviorSubject<Weather.IWeatherObject> {
    return this.behaviorSubjectWeather;
  }

  loadWeatherInCircle(options: Weather.IWeatherParams): void {
    // Todo: apply 'options' to current weaher download
    this.longitude = options.longitude;
    this.latitude = options.latitude;
    this.count = options.count;


    let lastUpdateTimeString: string = this.storageService.getData('lastUpdateTime');
    if (!lastUpdateTimeString) {
      // case: first load
      console.log('Nothing in storage. Load from internet.');
      this.initLoadInCircle(this.behaviorSubjectWeather);
    } else {
      // in milliseconds
      this.lastUpdateTime = parseInt(lastUpdateTimeString, 10);
      let paramsString: string = this.storageService.getData('params');
      let params: Weather.IWeatherParams = <Weather.IWeatherParams> JSON.parse(paramsString);
      if ((this.lastUpdateTime > (Date.now() - this.maxTimeValide)) &&
        params.latitude === this.latitude &&
        params.longitude === this.longitude &&
        params.count === this.count
      ) {
        // case: in storage are valid data then load from storage
        console.log('Valid in storage. Load from storage.');
        let weatherString = this.storageService.getData('weather');
        this.weatherObject = <Weather.IWeatherObject> JSON.parse(weatherString);
        this.behaviorSubjectWeather.next(this.weatherObject)
      } else {
        // case: in storage are expired data then load from internet
        console.log('Expired or invalid in storage. Load from internet.');
        // this.initLoadInCircle(resolve, reject);
        this.initLoadInCircle(this.behaviorSubjectWeather);
      }
    }

  }

  getRxLastUpdateTime(): BehaviorSubject<number> {
    return this.behaviorSubjectUpdateTime;
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

  private initLoadInCircle(subject: BehaviorSubject<Weather.IWeatherObject>) {
    let weather: Weather.IWeatherObject;
    let urlTemplate = `http://api.openweathermap.org/data/2.5/find?lat=` +
      `${this.latitude}&lon=${this.longitude}&cnt=${this.count}&appid=${this.API}`;
    this.restService.sendRequest(this.typeRequest, urlTemplate, this.async, '').then(
      (responseText: string) => {
        weather = <Weather.IWeatherObject> JSON.parse(responseText);
        this.lastUpdateTime = Date.now();
        this.weatherObject = weather;
        this.storageService.setData('lastUpdateTime', JSON.stringify(this.lastUpdateTime));
        this.storageService.setData('weather', JSON.stringify(this.weatherObject));
        this.storageService.setData('params', JSON.stringify({
          longitude: this.longitude,
          latitude: this.latitude,
          count: this.count})
        );
        subject.next(this.weatherObject);
      },
      () => {
        subject.error('Cann;t load data from server');
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
