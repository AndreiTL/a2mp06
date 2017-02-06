import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {template} from './loadmask.tpl';


@Component({
  selector: 'load-mask',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadMaskComponent {
  @Input() activate: boolean;

}