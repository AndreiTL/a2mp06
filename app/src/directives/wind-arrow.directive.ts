import { Directive, ElementRef, Input } from '@angular/core';
@Directive({
  selector: '[windArrow]'
})
export class WindArrowDirective {
  @Input() windArrow: string;
  constructor(private el: ElementRef) {
    el.nativeElement.style.transformOrigin = '12px';
    el.nativeElement.style.height = `24px`;
    el.nativeElement.style.width = `24px`;
    el.nativeElement.style.display = `table-cell`;
    el.nativeElement.style.verticalAlign = `middle`;
    el.nativeElement.style.textAlign = `center`;
  }
  ngAfterContentInit() {
    this.el.nativeElement.style.transform = `rotate(${this.windArrow}deg)`;
  }
}
