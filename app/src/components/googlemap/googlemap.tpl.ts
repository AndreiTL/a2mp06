export const template = `
<div>
    <div id="googlemap"></div>
    <div>
      <span>Current position:</span>                  
    </div>
    <div>
      <span>Latitude:</span>
      <span>{{googlemapCoordinates?.lat}}</span>
    </div>
    <div>
      <span>Longitude:</span>
      <span>{{googlemapCoordinates?.lng}}</span>
    </div>
    <div>
        <button (click)="addNearestTownWeather(googlemapCoordinates.lat, googlemapCoordinates.lng)">
            Add nearest town
        </button>
    </div>
</div>
`;
