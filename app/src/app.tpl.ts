export const template = `
<div class="rootcontainer">
  <div class="maincontent">
    <my-header [location]="coordinates"></my-header>
    <div class="appcontainer">
      <div *ngIf="!enableChild">   
          <span>Waiting for location resolve.</span>
      </div>
      <div *ngIf="enableChild">
          <div class="weatherbox">
              <weather [amounttowns]="amountTowns" [location]="coordinates"></weather>
          </div>
          <div class="googlemapbox">
              <googlemap [zoom]="zoom" [location]="coordinates"></googlemap>     
          </div>        
      </div>
    </div>
  </div>
  <div class="mainfooter">
    <my-footer></my-footer>
  </div>  
</div>
`;
