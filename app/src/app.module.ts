import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';

import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';

import { GooglemapComponent } from './components/googlemap/googlemap.component';
import { WeatherComponent } from './components/weather/weather.component';
import { LoadMaskComponent } from './components/loadmask/loadmask.component';

import {GoogleMapLoaderService} from './components/common/google_maps_loader.service';
import {LocationService} from './components/common/location.service';
import {StorageService} from './components/common/storage.service';
import {MarkersService} from './components/common/markers.service';
import {RestService} from './components/common/rest.service';
import {WeatherModelService} from './components/common/weather_model.service';
import {WeatherFavoriteModelService} from './components/common/weather_favorite_model.service';

import {TemperatureCelciumPipe} from './components/common/pipes/temperature.pipe';
import {WindDirectionTextPipe} from './components/common/pipes/winddirectiontext.pipe';

import {WindArrowDirective} from './directives/wind-arrow.directive';
import {TownColorDirective} from './directives/town-color.directive';
import {WeatherIconDirective} from './directives/weather-icon.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    GooglemapComponent,
    WeatherComponent,
    LoadMaskComponent,
    TemperatureCelciumPipe,
    WindDirectionTextPipe,
    WindArrowDirective,
    TownColorDirective,
    WeatherIconDirective
  ],
  providers: [
    RestService,
    MarkersService,
    StorageService,
    LocationService,
    WeatherModelService,
    WeatherFavoriteModelService,
    GoogleMapLoaderService],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
