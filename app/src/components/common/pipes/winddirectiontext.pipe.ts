import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'windDirectionTextPipe'})
export class WindDirectionTextPipe implements PipeTransform {
  transform(angle: number): string {
    let direction: string;
    const directions = {
      '0': 'North',
      '45': 'North-East',
      '90': 'East',
      '135': 'South-East',
      '180': 'South',
      '225': 'South-West',
      '270': 'West',
      '315': 'North-West',
      '360': 'North',
      'undefined': 'undefined'
    };
    if (!angle && angle !== 0) {
      direction = directions['undefined'];
    } else if (-22.5 < angle && angle <= 22.5) {
      direction = directions['0'];
    } else if (22.5 < angle && angle <= 67.5) {
      direction = directions['45'];
    } else if (67.5 < angle && angle <= 112.5) {
      direction = directions['90'];
    } else if (112.5 < angle && angle <= 157.5) {
      direction = directions['135'];
    } else if (157.5 < angle && angle <= 202.5) {
      direction = directions['180'];
    } else if (202.5 < angle && angle <= 247.5) {
      direction = directions['225'];
    } else if (247.5 < angle && angle <= 292.5) {
      direction = directions['270'];
    } else if (292.5 < angle && angle <= 337.5) {
      direction = directions['315'];
    } else if (337.5 < angle && angle <= 382.5) {
      direction = directions['360'];
    }
    return direction;
  }
}
