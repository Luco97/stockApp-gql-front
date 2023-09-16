import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  TemplateRef,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { coorAxis } from '@directives/coordinates';

@Component({
  selector: 'app-image-lens',
  templateUrl: './image-lens.component.html',
  styleUrls: ['./image-lens.component.scss'],
})
export class ImageLensComponent implements OnInit, AfterViewInit {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = '';
  @Input() imageLensAlt: string = '';
  @Input() scale: number = 1.5;
  @Input() boxSize: number = 300;
  @Output('mouseOverImage') mouseOverImage: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output('imageLensElement') imageLensElement: EventEmitter<TemplateRef<any>> =
    new EventEmitter<TemplateRef<any>>();
  @ViewChild('imageLensTemplate') imageLensTemplate!: TemplateRef<any>;
  viewInit: boolean = false;

  imageInfo: { coor: coorAxis; isIn: boolean } = {
    coor: { clientX: 0, clientY: 0, offsetX: 0, offsetY: 0 },
    isIn: false,
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.viewInit = true;
  }

  mouseOutput(event: coorAxis) {
    // console.log('--> ', event.offsetX, ', ', event.offsetY);
    this.imageInfo['coor'] = event;
    if (this.viewInit && this.imageInfo['isIn'])
      this.imageLensElement.emit(this.imageLensTemplate);
  }

  mouseEnter(event: boolean) {
    // console.log(event, ' <--');
    this.imageInfo['isIn'] = event;
    this.mouseOverImage.emit(event);
  }

  imageStyle(coor: coorAxis): Object {
    return {
      position: 'absolute',
      'transform-origin': 'top left',
      // TODO: no escalar y usar porcentajes (para imagen lente de mayor resolucion)
      transform: `scale(${this.scale})`,
      top: `-${coor['offsetY'] * this.scale - this.boxSize / 2}px`,
      left: `-${coor['offsetX'] * this.scale - this.boxSize / 2}px`,
    };
  }
}
