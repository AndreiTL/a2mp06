import {Component, Input, ChangeDetectorRef} from '@angular/core';
import {template} from './weather.tpl';

import {WeatherModelService} from '../common/weather_model.service';
import {WeatherFavoriteModelService} from '../common/weather_favorite_model.service';

@Component({
  selector: 'weather',
  template: template
})
export class WeatherComponent {
  @Input() location: ILocation.ICoordinates;
  @Input() amounttowns: string;

  weatherObject: Weather.IWeatherObject;

  trigLoad: boolean = false;
  trigLoadFavorite: boolean = false;
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
  }

  ngAfterContentInit() {
    this.weatherModelService.setWeatherParams({
      latitude: this.location.latitude,
      longitude: this.location.longitude,
      count: parseInt(this.amounttowns, 10)
    });
    this.weatherModelService.getWeatherInCircle().then(
      (weatherObj: Weather.IWeatherObject) => {
        this.weatherObject = weatherObj;
        this.townsTable = this.weatherObject.list;
      },
      () => {
        console.log('Cann\'t update table list! Input parameter is empty!');
        alert('Cann\'t update table list! Input parameter is empty!');
      }
    ).then( () => {
      this.updateTableList();
    });
    // this.favoriteTownsTable = this.weatherModelService.getFavoriteTownsWeather();
  }

  addTownFavoriteById(idString: string) {
    this.trigLoadFavorite = true;
    try {
      let id: number = parseInt(idString, 10);
      this.weatherFavoriteModelService.addToFavoriteById(id).then(
        (weather: Weather.IWeatherObject) => {
          this.favoriteTownsTable = weather.list;
          this.trigLoadFavorite = false;
        },
        () => {
          this.trigLoadFavorite = false;
          console.log(" Cann't reload weather for favorite towns. ");
          alert(" Cann't reload weather for favorite towns. ");
        }
      );
      this.newTownId = '';
    } catch (e) {
      this.trigLoadFavorite = false;
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
    this.trigLoadFavorite = true;
    this.weatherFavoriteModelService.reloadFavoriteTownsWeather().then(
      (weather: Weather.IWeatherObject) => {
        this.favoriteTownsTable = weather.list;
        this.trigLoadFavorite = false;
        console.log(' Favorites towns weather was updated.');
      },
      () => {
        this.trigLoadFavorite = false;
        console.log(" Cann't reload weather for favorite towns. ");
        alert(" Cann't reload weather for favorite towns. ");
      }
    );
  }

  private updateTableList() {
    this.trigLoad = true;
    this.cd.detectChanges();
  }
}
