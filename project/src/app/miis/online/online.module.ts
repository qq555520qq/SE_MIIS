import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineComponent } from './online.component';
import { CommonsModule } from '../../common/commons.module';



@NgModule({
  declarations: [OnlineComponent],
  imports: [
    CommonModule,
    CommonsModule
  ],
  exports: [
    OnlineComponent
  ]
})
export class OnlineModule { }
