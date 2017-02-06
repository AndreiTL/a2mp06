import { Directive, ElementRef, Input } from '@angular/core';
@Directive({
  selector: '[townColor]'
})
export class TownColorDirective {
  @Input() townColor: string;
  constructor(private el: ElementRef) {
    // el.nativeElement.style.backgroundColor = this.calculateColor(this.temperature);
  }

  ngAfterContentInit() {
    this.el.nativeElement.style.backgroundColor = this.calculateColor(parseInt(this.townColor, 10));
  }

  calculateColor(temperature: number): string {
    const zeroNumber: number = 12;
    const maxNumber: number = 21;
    const step: number = 3;
    let colors: string[] = [
      '#ffcccc',
      '#ffd9cc',
      '#ffe6cc',
      '#fff2cc',
      '#ffffcc',
      '#f2ffcc',
      '#e6ffcc',
      '#d9ffcc',
      '#ccffcc',
      '#ccffd9',
      '#ccffe6',
      '#ccfff2',
      '#ccffff',
      '#ccf2ff',
      '#cce6ff',
      '#ccd9ff',
      '#ccccff',
      '#d9ccff',
      '#e6ccff',
      '#f2ccff',
      '#ffccff',
      '#ffccf2',
      '#ffcce6',
      '#ffccd9',
      '#ffcccc'
    ];

    let numberColor: number = zeroNumber - Math.ceil((temperature - 273.15) / step);
    if (numberColor < 0) {
      numberColor = 0;
    } else {
      if (numberColor > maxNumber) {
        numberColor = maxNumber;
      }
    }
    return colors[numberColor];
  }
}
