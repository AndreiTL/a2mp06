export const template = `
<div class="header">
    <div class="appcontainer">
        <div><span>Last update: </span><span>{{lastUpddateTime| date:'medium'}}</span></div>
        <div><span>Longitude: </span><span>{{location?.longitude | number: '1.2-2'}}</span></div>
        <div><span>Latitude: </span><span>{{location?.latitude}}</span></div>
        <!--<div>-->
            <!--<span>longitude</span>-->
            <!--<input [(ngModel)]="location.longitude">-->
        <!--</div>-->
        <!--<div>-->
            <!--<span>latitude</span>-->
            <!--<input [(ngModel)]="location.latitude">-->
        <!--</div>-->
        
    </div>    
</div>
`;
