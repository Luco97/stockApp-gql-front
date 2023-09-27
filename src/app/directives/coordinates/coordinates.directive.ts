import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

export interface coorAxis {
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
  naturalWidth: number;
  naturalHeight: number;
}

@Directive({
  selector: '[coorAxis]',
})
export class CoordinatesDirective {
  @Output('coordinates') private _coordinates: EventEmitter<coorAxis> =
    new EventEmitter<coorAxis>();
  @Output('mouseEnter') private _mouseEnter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent) {
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } =
      event.currentTarget as HTMLImageElement;
    this._coordinates.emit({
      offsetX: event.offsetX,
      offsetY: event.offsetY,
      clientX: event.clientX,
      clientY: event.clientY,
      naturalWidth: naturalWidth || clientWidth,
      naturalHeight: naturalHeight || clientHeight,
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
