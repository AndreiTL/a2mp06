import { Directive, ElementRef, Input } from '@angular/core';
@Directive({
  selector: '[weatherIcon]'
})
export class WeatherIconDirective {
  @Input() weatherIcon: string;
  constructor(private el: ElementRef) {

  }

  ngAfterContentInit() {
    let element = new ElementRef(
      `<img src="http://openweathermap.org/img/w/${this.weatherIcon}.png" class="weather-icon">`
    );
    this.el.nativeElement.innerHTML = element.nativeElement;
  };
}
