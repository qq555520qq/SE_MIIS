import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseComponent } from './case.component';
import { CommonsModule } from '../../common/commons.module';




@NgModule({
  declarations: [CaseComponent],
  imports: [
    CommonModule,
    CommonsModule
  ],
  exports: [
    CaseComponent
  ]
})
export class CaseModule { }
