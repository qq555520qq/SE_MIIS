import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-miis',
  templateUrl: './miis.component.html',
  styleUrls: ['./miis.component.css']
})
export class MIISComponent implements OnInit {
  /** 登入使用者 */
  loginUser: string;
  /** 系統選單 */
  items: MenuItem[] = [
    {
      label: 'FHIR',
      items: [
        {
          label: 'User Account Management', command: (click) => {
            this.apperPage = 'roles';
          }
        },
        {
          label: 'Medical Record Management', command: (click) => {
            this.apperPage = 'case';
          }
        },
        {
          label: 'Online Service',
          items: [{
            label: 'Appointment', command: (click) => {
              this.apperPage = 'appointment';
            }
          }, {
            label: 'Rental', command: (click) => {
              this.apperPage = 'rental';
            }
          }
          ]
        }
      ]
    }
  ];
  /** 目前顯示頁面 */
  apperPage = 'login';
  /** 標題 */
  titleName = 'Medical Information Integration System';
  /** toastList */
  showKeys = ['showTopCenter', 'showTopRight', 'showTopLeft', 'showBottomRight', 'showBottomLeft', 'showBottomCenter'];

  constructor(private messageService: MessageService) {

  }

  ngOnInit() {
  }

  /** 成功登入後進行判斷 */
  loginSuccess() {
    this.apperPage = 'Index';
    this.loginUser = sessionStorage.getItem('name');
    this.messageService.add({
      key: 'showTopCenter', life: 2000, severity: 'success', summary: 'Login successfully',
      detail: 'Welcome to system!', closable: false
    });
  }
  /** 登出回到登入畫面 */
  logOut() {
    sessionStorage.clear();
    this.apperPage = 'login';
  }

  /** 顯示使用者姓名 */
  showUser() {
    this.messageService.clear();
    this.messageService.add({
      key: this.showKeys[Math.floor(Math.random() * this.showKeys.length)], life: 1000, severity: 'info', summary: 'Hi,' + this.loginUser,
      detail: 'Welcome To System!', closable: false
    });
  }
}
