import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineRentalComponent } from './online-rental.component';
import { CommonsModule } from '../../common/commons.module';

@NgModule({
  declarations: [OnlineRentalComponent],
  imports: [
    CommonModule,
    CommonsModule
  ],
  exports: [
    OnlineRentalComponent
  ]
})
export class OnlineRentalModule { }
