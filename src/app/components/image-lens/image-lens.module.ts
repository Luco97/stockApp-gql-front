import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageLensComponent } from './image-lens.component';
import { CoordinatesModule } from '@directives/coordinates';

@NgModule({
  declarations: [ImageLensComponent],
  imports: [CommonModule, CoordinatesModule],
  exports: [ImageLensComponent],
})
export class ImageLensModule {}
