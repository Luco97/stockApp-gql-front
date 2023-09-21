import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinatesModule } from '@directives/coordinates';
import { ImageLensComponent } from './image-lens.component';

@NgModule({
  declarations: [ImageLensComponent],
  imports: [CommonModule, CoordinatesModule],
  exports: [ImageLensComponent],
})
export class ImageLensModule {}
