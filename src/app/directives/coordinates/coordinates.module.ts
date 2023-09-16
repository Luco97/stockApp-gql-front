import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinatesDirective } from './coordinates.directive';

@NgModule({
  declarations: [CoordinatesDirective],
  imports: [CommonModule],
  exports: [CoordinatesDirective],
})
export class CoordinatesModule {}
