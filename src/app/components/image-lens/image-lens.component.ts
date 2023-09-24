import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  TemplateRef,
  EventEmitter,
  ElementRef,
  HostListener,
} from '@angular/core';
import { coorAxis } from '@directives/coordinates';

/**
 * TODO: ejemplo para uso basico
 */
@Component({
  selector: 'app-image-lens',
  templateUrl: './image-lens.component.html',
  styleUrls: ['./image-lens.component.scss'],
})
export class ImageLensComponent implements OnInit {
  @HostListener('wheel', ['$event']) wheelEvent(event: WheelEvent) {
    if (event.deltaY > 0 && this.scale > 0.75) {
      // scroll down, zoom out
      this.scale -= 0.05;
      this.zoom.emit('out');
    } else if (event.deltaY < 0) {
      // scroll up, zoom in
      this.scale += 0.05;
      this.zoom.emit('in');
    }
  }

  /**
   * imagen pequeña tipo thumbnail
   */
  @Input() imageUrl: string = '';
  /**
   * imagen con mayor resolucion
   */
  @Input() imageLensUrl: string = '';
  @Input() imageAlt: string = '';
  @Input() imageLensAlt: string = '';
  /**
   * proporcion para tamaño de img con mayor resolucion
   */
  @Input() boxSize: number = 5;
  /**
   * Emite evento mouseover sobre imageUrl
   */
  @Output('mouseOverImage') mouseOverImage: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  /**
   * Emite evento mouseover sobre imageUrl
   */
  @Output('zoom') zoom: EventEmitter<'in' | 'out'> = new EventEmitter<
    'in' | 'out'
  >();
  /**
   * Emite template de imageLensUrl
   */
  @Output('imageLensElement') imageLensElement: EventEmitter<TemplateRef<any>> =
    new EventEmitter<TemplateRef<any>>();
  /**
   * Emite template de un div con imagen en en background-image: url(...)
   */
  @Output('bgLensElement') bgLensElement: EventEmitter<TemplateRef<any>> =
    new EventEmitter<TemplateRef<any>>();

  @ViewChild('imageLensTemplate')
  private _imageLensTemplate!: TemplateRef<any>;
  @ViewChild('bgLensTemplate')
  private _bgLensTemplate!: TemplateRef<any>;
  @ViewChild('imageLens') private _imageLens!: ElementRef<HTMLImageElement>;
  scale: number = 1;

  // TODO: definir ideal en tamaño de imagen que se emite por output
  get boxSizeWidth(): number {
    return this._imageLens.nativeElement.naturalWidth / this.boxSize ?? 300;
  }
  get boxSizeHeight(): number {
    return this._imageLens.nativeElement.naturalHeight / this.boxSize ?? 300;
  }

  imageInfo: { coor: coorAxis; isIn: boolean } = {
    coor: {
      clientX: 0,
      clientY: 0,
      offsetX: 0,
      offsetY: 0,
      naturalWidth: 0,
      naturalHeight: 0,
    },
    isIn: false,
  };

  constructor() {}

  ngOnInit(): void {}

  mouseOutput(event: coorAxis) {
    this.imageInfo['coor'] = event;
    if (this._imageLensTemplate && this.imageInfo['isIn'])
      this.imageLensElement.emit(this._imageLensTemplate);
    if (this._bgLensTemplate && this.imageInfo['isIn'])
      this.bgLensElement.emit(this._bgLensTemplate);
  }

  mouseEnter(event: boolean) {
    this.imageInfo['isIn'] = event;
    this.mouseOverImage.emit(event);
  }

  imageStyle(coor: coorAxis): Object {
    let x_axis: number =
        (coor['offsetX'] / coor['naturalWidth']) *
          this._imageLens.nativeElement.naturalWidth *
          this.scale -
        this.boxSizeWidth / 2,
      y_axis: number =
        (coor['offsetY'] / coor['naturalHeight']) *
          this._imageLens.nativeElement.naturalHeight *
          this.scale -
        this.boxSizeHeight / 2;
    if (x_axis + this.boxSizeWidth > this._imageLens.nativeElement.naturalWidth)
      x_axis = this._imageLens.nativeElement.naturalWidth - this.boxSizeWidth;
    if (x_axis < 0) x_axis = 0;
    if (
      y_axis + this.boxSizeHeight >
      this._imageLens.nativeElement.naturalHeight
    )
      y_axis = this._imageLens.nativeElement.naturalHeight - this.boxSizeHeight;
    if (y_axis < 0) y_axis = 0;
    const style: Object = {
      position: 'absolute',
      'transform-origin': 'top left',
      // scale para zoom (mejor aumentar escala que descargar otra en mayor res)
      transform: `scale(${this.scale ?? 0.01})`,
      top: `-${y_axis}px`,
      left: `-${x_axis}px`,
    };
    return style;
  }

  bgStyle(coor: coorAxis): Object {
    let x_axis: number =
        (coor['offsetX'] / coor['naturalWidth']) *
          this._imageLens.nativeElement.naturalWidth *
          this.scale -
        this.boxSizeWidth / 2,
      y_axis: number =
        (coor['offsetY'] / coor['naturalHeight']) *
          this._imageLens.nativeElement.naturalHeight *
          this.scale -
        this.boxSizeHeight / 2;
    if (x_axis + this.boxSizeWidth > this._imageLens.nativeElement.naturalWidth)
      x_axis = this._imageLens.nativeElement.naturalWidth - this.boxSizeWidth;
    if (x_axis < 0) x_axis = 0;
    if (
      y_axis + this.boxSizeHeight >
      this._imageLens.nativeElement.naturalHeight
    )
      y_axis = this._imageLens.nativeElement.naturalHeight - this.boxSizeHeight;
    if (y_axis < 0) y_axis = 0;

    const style: Object = {
      'background-image': `url(${this.imageLensUrl})`,
      'background-repeat': 'no-repeat',
      'background-position': `-${x_axis}px -${y_axis}px`,
      width: this.boxSizeWidth + 'px',
      height: this.boxSizeHeight + 'px',
    };
    return style;
  }
}
