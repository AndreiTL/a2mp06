import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {RestService} from './rest.service';
import {BehaviorSubject, Subject} from 'rxjs'
import IWeather = Weather.IWeather;

@Injectable()
export class WeatherModelService {

  callFunctionsArray: Function[];
  weatherObject: Weather.IWeatherObject;

  // 10 minutes
  maxTimeValide: number = 10 * 60 * 1000;

  API: string = `94c7919f6854ca11558382472a998f8f`;

  typeRequest: string = 'GET';
  async: boolean = true;

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
    this.subjectWeather = new Subject<Weather.IWeatherObject>();
    this.subjectTownsWeather = new Subject<Weather.ITownWeather[]>();
    this.subjectUpdateTime = new Subject<number>();

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

  removeTown(id: number): void {
    let indexRemove: number = this.townsWeather.findIndex((value: Weather.ITownWeather) => {
      console.log(value.id + ' ' + (value.id === id));
      return value.id === id;
    });
    if (indexRemove > -1) {
      this.townsWeather.splice(indexRemove, 1);
    }
    console.log(indexRemove);
    this.subjectTownsWeather.next(this.townsWeather);
  }

  // add new town to weather towns list
  addNearestTowns(options: Weather.IWeatherParams) {
      this.initLoadInCircle(options).then(
        this.promiseLoadHandlerResolve,
        this.promiseLoadHandlerReject
      );
  }

  // load clean new weather towns list
  loadWeatherInCircle(options: Weather.IWeatherParams): void {
    this.townsWeather = [];
    let lastUpdateTimeString: string = this.storageService.getData('lastUpdateTime');
    if (!lastUpdateTimeString) {
      // case: first load
      console.log('Nothing in storage. Load from internet.');
      this.addNearestTowns(options);
    } else {
      // in milliseconds
      this.lastUpdateTime = parseInt(lastUpdateTimeString, 10);
      if ((this.lastUpdateTime > (Date.now() - this.maxTimeValide))) {
        // case: in storage are valid data then load from storage
        console.log('Valid in storage. Load from storage.');
        let townsString = this.storageService.getData('townsweather');
        this.townsWeather.push(...<Weather.ITownWeather[]>JSON.parse(townsString));
        this.subjectTownsWeather.next(this.townsWeather);
      } else {
        // case: in storage are expired data then load from internet
        console.log('Expired or invalid in storage. Load from internet.');
        this.addNearestTowns(options);
      }
    }
  }

  getRxLastUpdateTime(): Subject<number> {
    return this.subjectUpdateTime;
  }

  getLastUpdateTime(): number {
    return parseInt(this.storageService.getData('lastUpdateTime'), 10);
  }

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

  private promiseLoadHandlerResolve = (townList: Weather.ITownWeather[]) => {
    this.storageService.setData('lastUpdateTime', JSON.stringify(this.lastUpdateTime));
    this.storageService.setData('townsweather', JSON.stringify(this.weatherObject.list));
    this.townsWeather.push(...townList);
    this.subjectTownsWeather.next(this.townsWeather);
  };
  private promiseLoadHandlerReject = (error: string) => {
    this.subjectTownsWeather.error(error);
  };


  //subject: Subject<Weather.IWeatherObject>
  private initLoadInCircle(options: Weather.IWeatherParams): Promise<Weather.ITownWeather[]> {
    let weather: Weather.IWeatherObject;
    let urlTemplate = `http://api.openweathermap.org/data/2.5/find?lat=` +
      `${options.latitude}&lon=${options.longitude}&cnt=${options.count}&appid=${this.API}`;
    return new Promise((resolve, reject) => {
      this.restService.sendRequest(this.typeRequest, urlTemplate, this.async, '').then(
        (responseText: string) => {
          weather = <Weather.IWeatherObject> JSON.parse(responseText);
          this.lastUpdateTime = Date.now();
          this.weatherObject = weather;
          // and when weather.cod===200
          if (weather && weather.list && weather.list.length > 0) {
            resolve(weather.list);
          } else {
            reject('Cann\'t load data from server');
          }
        },
        () => {
          reject('Cann\'t load data from server');
        });
    })
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
