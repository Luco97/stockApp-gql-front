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
      // scroll down
      this.scale -= 0.05;
    } else if (event.deltaY < 0) {
      // scroll up
      this.scale += 0.05;
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
   * Emite template de imageLensUrl
   */
  @Output('imageLensElement') imageLensElement: EventEmitter<TemplateRef<any>> =
    new EventEmitter<TemplateRef<any>>();
  @ViewChild('imageLensTemplate')
  private _imageLensTemplate!: TemplateRef<any>;
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
  }

  mouseEnter(event: boolean) {
    this.imageInfo['isIn'] = event;
    this.mouseOverImage.emit(event);
  }

  imageStyle(coor: coorAxis): Object {
    return {
      position: 'absolute',
      'transform-origin': 'top left',
      // scale para zoom (mejor aumentar escala que descargar otra en mayor res)
      transform: `scale(${this.scale ?? 0.01})`,
      top: `-${
        (coor['offsetY'] / coor['naturalHeight']) *
          this._imageLens.nativeElement.naturalHeight *
          this.scale -
        this.boxSizeHeight / 2
      }px`,
      left: `-${
        (coor['offsetX'] / coor['naturalWidth']) *
          this._imageLens.nativeElement.naturalWidth *
          this.scale -
        this.boxSizeWidth / 2
      }px`,
    };
  }
}
