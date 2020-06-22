import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// primeng
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputMaskModule } from 'primeng/inputmask';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    MenubarModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    PasswordModule,
    CalendarModule,
    DropdownModule,
    ChartModule,
    ToastModule,
    ContextMenuModule,
    ConfirmDialogModule,
    InputSwitchModule,
    MultiSelectModule,
    AutoCompleteModule,
    ScrollPanelModule,
    InputMaskModule
  ],
  exports: [
    MenuModule,
    ButtonModule,
    MenubarModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    PasswordModule,
    CalendarModule,
    DropdownModule,
    ChartModule,
    ToastModule,
    ContextMenuModule,
    ConfirmDialogModule,
    InputSwitchModule,
    MultiSelectModule,
    AutoCompleteModule,
    ScrollPanelModule,
    InputMaskModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class CommonsModule { }
