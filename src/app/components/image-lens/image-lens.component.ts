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
 * Imagen en uso, misma imagen pero en distinta calidad
 * se utiliza imagen con menor calidad para usar lupa sobre
 * y se utiliza imagen de mayor calidad para zoom
 * ```html
 * <div style="display: flex">
  <app-image-lens
    [imageUrl]="
      'https://res.cloudinary.com/dogjjjeg2/image/upload/c_thumb,w_400,g_face/v1680327202/samples/landscapes/architecture-signs.jpg'
    "
    [imageLensUrl]="
      'https://res.cloudinary.com/dogjjjeg2/image/upload/c_scale,w_1280/v1680327202/samples/landscapes/architecture-signs.jpg'
    "
    [imageAlt]="'Imagen prueba'"
    (mouseOverImage)="imageMouse($event)"
    (imageLensElement)="imageOutput($event)"
    (bgLensElement)="imageBgOutput($event)"
    [boxSize]="3.5"
    [templateOver]="false"
  ></app-image-lens>

  <div *ngIf="imageIn" style="border: 3px solid greenyellow">
    <ng-container *ngTemplateOutlet="myTemplate"></ng-container>
  </div>
</div>
<div style="display: flex">
  <div *ngIf="true" style="display: flex; flex-direction: column">
    <p>img</p>
    <div style="border: 3px solid red">
      <ng-container *ngTemplateOutlet="myTemplate"></ng-container>
    </div>
  </div>
  <div *ngIf="true" style="display: flex; flex-direction: column">
    <p>background</p>
    <div style="border: 3px solid greenyellow">
      <ng-container *ngTemplateOutlet="myTemplateBg"></ng-container>
    </div>
  </div>
</div>
 * ```
 */
@Component({
  selector: 'app-image-lens',
  templateUrl: './image-lens.component.html',
  styleUrls: ['./image-lens.component.scss'],
})
export class ImageLensComponent implements OnInit {
  // TODO: funciona como el poto, arreglar
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
   *@value false emite template (tipo mercado libre o amazon)
   *@value true muestra imagen ampliada tipo aliexpress (pero con mayor resolucion)
   *@defaultValue false
   */
  @Input() templateOver: boolean = false;

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

  // TODO: definir ideal en tamaño de imagen que se emite por output --> 2.5 es ideal
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

  mouseDance(event: MouseEvent) {
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } =
      event.currentTarget as HTMLImageElement;
    this.imageInfo['coor'] = {
      offsetX: event.offsetX,
      offsetY: event.offsetY,
      clientX: event.clientX,
      clientY: event.clientY,
      naturalWidth: naturalWidth || clientWidth,
      naturalHeight: naturalHeight || clientHeight,
    };
  }
  mouseIn() {
    this.imageInfo['isIn'] = true;
  }
  mouseOut() {
    this.imageInfo['isIn'] = false;
  }

  private _getAxis(
    coor: coorAxis,
    scale: number
  ): { x_axis: number; y_axis: number } {
    let x_axis: number =
        (coor['offsetX'] / coor['naturalWidth']) *
          this._imageLens.nativeElement.naturalWidth *
          scale -
        this.boxSizeWidth / 2,
      y_axis: number =
        (coor['offsetY'] / coor['naturalHeight']) *
          this._imageLens.nativeElement.naturalHeight *
          scale -
        this.boxSizeHeight / 2;

    // Para evitar seguir moviendo cuando no hay imagen por left & top
    if (x_axis < 0) x_axis = 0;
    if (y_axis < 0) y_axis = 0;

    // Para evitar seguir moviendo cuando no hay imagen por right & bottom
    if (
      x_axis + this.boxSizeWidth >
      this._imageLens.nativeElement.naturalWidth * scale
    )
      x_axis =
        this._imageLens.nativeElement.naturalWidth * scale - this.boxSizeWidth;
    if (
      y_axis + this.boxSizeHeight >
      this._imageLens.nativeElement.naturalHeight * scale
    )
      y_axis =
        this._imageLens.nativeElement.naturalHeight * scale -
        this.boxSizeHeight;

    return { x_axis, y_axis };
  }

  imageStyle(coor: coorAxis): Object {
    const { x_axis, y_axis } = this._getAxis(coor, this.scale);
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
    const { x_axis, y_axis } = this._getAxis(coor, 1);
    let dynamicWidth = this.boxSizeWidth - this.boxSizeWidth * this.scale;
    let dynamicHeight = this.boxSizeHeight - this.boxSizeHeight * this.scale;
    if (this.scale < 1) {
      dynamicWidth = this.boxSizeWidth + dynamicWidth;
      dynamicHeight = this.boxSizeHeight + dynamicHeight;
    } else {
      dynamicWidth = this.boxSizeWidth;
      dynamicHeight = this.boxSizeHeight;
    }
    const style: Object = {
      'background-image': `url(${this.imageLensUrl})`,
      'background-repeat': 'no-repeat',
      top: 0,
      left: 0,
      'background-position': `-${x_axis}px -${y_axis}px`,
      transform: `scale(${this.scale < 1 ? 1 : this.scale})`,
      width: dynamicWidth + 'px',
      height: dynamicHeight + 'px',
    };
    return style;
  }

  bgStyleOver(coor: coorAxis): Object {
    if (this._imageLens) {
      const { x_axis, y_axis } = this._getAxis(coor, 1);
      const style: Object = {
        position: 'absolute',
        top: 0,
        left: 0,
        // 'transform-origin': 'top left',
        'background-image': `url(${this.imageLensUrl})`,
        'background-repeat': 'no-repeat',
        'background-position': `-${x_axis}px -${y_axis}px`,
        transform: `scale(${this.scale ?? 0.01})`,
        width: '100%',
        height: '100%',
      };
      return style;
    }
    return {};
  }
}
