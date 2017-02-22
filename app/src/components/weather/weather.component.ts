import {Component, Input, ChangeDetectorRef} from '@angular/core';
import {template} from './weather.tpl';

import {WeatherModelService} from '../common/weather_model.service';
import {WeatherFavoriteModelService} from '../common/weather_favorite_model.service';
import {Observable, Observer} from "rxjs";

@Component({
  selector: 'weather',
  template: template
})
export class WeatherComponent {
  @Input() location: ILocation.ICoordinates;
  @Input() amounttowns: string;

  townsWeatherSource: Observable<Weather.ITownWeather[]>;

  townsWeatherObserver: () => Observer<Weather.ITownWeather[]>;

  weatherObject: Weather.IWeatherObject;

  isLoading: boolean = true;
  isLoadingFavorite: boolean = true;
  townsTable: Weather.ITownWeather[] ;
  favoriteTownsTable: Weather.ITownWeather[];

  newTownId: string;

  constructor(
      private cd: ChangeDetectorRef,
      private weatherModelService: WeatherModelService,
      private weatherFavoriteModelService: WeatherFavoriteModelService
    ) {
    console.log('WeatherComponent init.');
    this.townsTable = [];
    this.favoriteTownsTable = this.weatherFavoriteModelService.getFavoriteTownsWeather();

    this.townsWeatherSource = this.weatherModelService.getRxTownsWeather();

    this.townsWeatherObserver = () => {return {
      next: value => {
        console.log('next weather');
        console.dir(value);
        this.isLoading = false;
        this.townsTable = value;
        this.cd.detectChanges();
      },
      error: err => {
        this.isLoading = false;
        console.log('err weather');
        console.dir(err);
      },
      complete: () => {
        this.isLoading = false;
        console.log('comlete thread weather');
      }
    }};

    this.townsWeatherSource.subscribe(this.townsWeatherObserver());
  }

  ngAfterContentInit() {
    this.isLoading = true;
    this.weatherModelService.loadWeatherInCircle({
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        count: parseInt(this.amounttowns, 10)
      });
  }

  addTownById(idString: string) {
    this.isLoading = true;
    try {
      let id: number = parseInt(idString, 10);
      this.weatherModelService.addTownById(id);
    } catch (e) {
      this.isLoading = false;
      console.log((<Error>e).message);
      alert((<Error>e).message);
    }
  }

  removeTown(id: number) {
    console.log(id);
    this.weatherModelService.removeTown(id);
  }


  addTownFavoriteById(idString: string) {
    this.isLoadingFavorite = true;
    try {
      let id: number = parseInt(idString, 10);
      this.weatherFavoriteModelService.addToFavoriteById(id).then(
        (weather: Weather.IWeatherObject) => {
          this.favoriteTownsTable = weather.list;
          this.isLoadingFavorite = false;
        },
        () => {
          this.isLoadingFavorite = false;
          console.log(" Cann't reload weather for favorite towns. ");
          alert(" Cann't reload weather for favorite towns. ");
        }
      );
      this.newTownId = '';
    } catch (e) {
      this.isLoadingFavorite = false;
      console.log((<Error>e).message);
      alert((<Error>e).message);
    }
  }

  addTownFavorite(town: Weather.ITownWeather) {
    console.log(" Add to favorite " + town.id);
    this.weatherFavoriteModelService.addToFavorite(town);
    this.favoriteTownsTable = this.weatherFavoriteModelService.getFavoriteTownsWeather();
  }

  removeTownFavorite(town: Weather.ITownWeather) {
    console.log(" Remove from favorite " + town.id);
    this.weatherFavoriteModelService.removeFromFavorite(town);
    this.favoriteTownsTable = this.weatherFavoriteModelService.getFavoriteTownsWeather();
  }

  clearFavorite() {
    this.favoriteTownsTable = [];
    this.weatherFavoriteModelService.removeAllFavorites();
  }

  reloadFavoritesTownsWeather(): void {
    this.isLoadingFavorite = true;
    this.weatherFavoriteModelService.reloadFavoriteTownsWeather().then(
      (weather: Weather.IWeatherObject) => {
        this.favoriteTownsTable = weather.list;
        this.isLoadingFavorite = false;
        console.log(' Favorites towns weather was updated.');
      },
      () => {
        this.isLoadingFavorite = false;
        console.log(" Cann't reload weather for favorite towns. ");
        alert(" Cann't reload weather for favorite towns. ");
      }
    );
  }

  private updateTableList() {
    this.isLoading = false;
    this.cd.detectChanges();
  }
}
