export const template = `
<div class="pos-relative">
    <load-mask [activate]="!trigLoad"></load-mask>
    <div class="pos-relative">
        <load-mask [activate]="trigLoadFavorite"></load-mask>
        <div class="weather-line-title">Favorite Towns:</div>
        <div>
            <input type="text" [(ngModel)]="newTownId">
            <button (click)="addTownFavoriteById(newTownId)">
                <span>Add town to Favorite by id</span>                
            </button>
        </div>
        <div *ngIf="favoriteTownsTable.length > 0" class="pos-relative">
                    
            <div class="favorite-pane">            
                <button (click)="reloadFavoritesTownsWeather()" class="favorite-button-right">
                    <span>Reload</span>
                </button>
            </div>
            <ul>
                <li *ngFor="let town of favoriteTownsTable" 
                      class="rowelement"
                      [townColor]="town.main.temp||'0'">
                    <table class="tablerow">
                      <tr>
                          <td><span class="townname">{{town.name}}</span></td>
                          <td>
                            <div [weatherIcon]="town.weather[0].icon"></div>
                          </td>
                          <td>
                              <div class="inlineblock">
                                  <span>{{town.wind.deg | windDirectionTextPipe}}</span>
                              </div>
                              <div class="inlineblock">
                                  <div [windArrow]="town.wind.deg||0">
                                      <span>&#8595;</span>
                                  </div>
                              </div>
                          </td>
                          <td>
                              <button (click)="removeTownFavorite(town)">
                                  <span>Unfav</span>
                              </button>
                          </td>
                      </tr>
                      <tr>
                          <td>                                    
                                <span>Temperature: </span>
                                <span>{{town.main.temp | temperatureCelciumPipe}}</span>
                          </td>
                          <td><span>Humidity: </span><span>{{town.main.humidity||''}}</span></td>
                          <td><span>Wind: </span><span>{{town.wind.speed||''}}</span><span> m/s</span></td>
                          <td></td>
                      </tr>
                  </table>
                </li>
            </ul>
            <div class="favorite-pane">            
                <button (click)="clearFavorite()" class="favorite-button-right">
                    <span>Remove all Favorites</span>
                </button>
            </div>
        </div>
    </div>
    
    <div class="weather-line-title">Weather in towns: </div>      
    <div *ngIf="trigLoad">
        <ul>
          <li *ngFor="let town of townsTable" 
                      class="rowelement"
                      [townColor]="town.main.temp||'0'">
              <table class="tablerow">
                <tr>
                    <td><span class="townname">{{town.name}}</span></td>
                    <td>
                      <div [weatherIcon]="town.weather[0].icon"></div>
                    </td>
                    <td>
                        <div class="inlineblock">
                            <span>{{town.wind.deg | windDirectionTextPipe}}</span>
                        </div>
                        <div class="inlineblock">
                            <div [windArrow]="town.wind.deg||0">
                                <span>&#8595;</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button (click)="addTownFavorite(town)">
                            <span>Fav</span>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td><span>Temperature: </span><span>{{town.main.temp | temperatureCelciumPipe}}</span></td>
                    <td><span>Humidity: </span><span>{{town.main.humidity||''}}</span></td>
                    <td><span>Wind: </span><span>{{town.wind.speed||''}}</span><span> m/s</span></td>
                    <td></td>
                </tr>
            </table>
          </li>
      </ul>
    </div>    
</div>
`;
