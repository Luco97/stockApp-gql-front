import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

export interface coorAxis {
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
}

@Directive({
  selector: '[coorAxis]',
})
export class CoordinatesDirective {
  @Output('coordinates') private _coordinates: EventEmitter<coorAxis> =
    new EventEmitter<coorAxis>();
  @Output('mouseEnter') private _mouseEnter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  // private coordinates: coorAxis = { x: 0, y: 0 };

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent) {
    // this.coordinates['x'] = event.clientX;
    // this.coordinates['y'] = event.clientY;
    // console.log('--> ', event.clientX, ', ', event.clientY);
    this._coordinates.emit({
      offsetX: event.offsetX,
      offsetY: event.offsetY,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }
  @HostListener('mouseenter', ['$event']) mouseEnter(event: MouseEvent) {
    this._mouseEnter.emit(true);
  }
  @HostListener('mouseleave', ['$event']) mouseLeave(event: MouseEvent) {
    this._mouseEnter.emit(false);
  }

  constructor() {}
}
