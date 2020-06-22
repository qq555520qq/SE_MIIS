import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { CommonsModule } from '../../common/commons.module';



@NgModule({
  declarations: [AccountsComponent],
  imports: [
    CommonModule,
    CommonsModule
  ],
  exports: [
    AccountsComponent
  ]
})
export class RolesModule { }
