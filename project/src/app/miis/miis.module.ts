import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MIISComponent } from './miis.component';
import { CaseModule } from './case/case.module';
import { OnlineModule } from './online/online.module';
import { RolesModule } from './accounts/accounts.module';
import { CommonsModule } from '../common/commons.module';
import { LoginModule } from './login/login.module';
import { OnlineRentalModule } from './online-rental/online-rental.module';


@NgModule({
  declarations: [
    MIISComponent
  ],
  imports: [
    CommonModule,
    CommonsModule,
    CaseModule,
    OnlineModule,
    RolesModule,
    LoginModule,
    OnlineRentalModule
  ],
  exports: [
    MIISComponent,
    CaseModule,
    OnlineModule,
    RolesModule,
    CommonsModule,
    LoginModule,
    OnlineRentalModule
  ]
})
export class MIISModule { }
