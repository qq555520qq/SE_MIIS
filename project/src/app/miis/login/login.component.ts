import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Account } from '../../../assets/models/account';
import { MessageService } from 'primeng/api';
import { Mail } from '../../../assets/models/mail';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() loginBool = new EventEmitter<object>();
  constructor(public apiService: ApiService, private messageService: MessageService) { }

  /** 帳號資訊 */
  accountInfo = { user: '', pass: '' };
  /** 帳號資訊 */
  accounts: Account[] = [];
  /** 目前顯示頁面 */
  appearPage = 'login';
  /** 密碼是否正確 */
  passwordCurrent = false;
  /** 顯示忘記密碼頁面 */
  showForgot = false;
  /** 忘記密碼確認email */
  emailForgot: string;
  /** 忘記密碼確認帳號 */
  accountForgot: string;

  // _pass_
  ngOnInit() {
    this.getAccount();
  }

  // _fail_
  /** 登入判斷 */
  login() {
    if (this.accountInfo.user === 'admin' && this.accountInfo.pass === 'admin') {
      sessionStorage.setItem('name', 'Admin');
      sessionStorage.setItem('idNum', 'L123456789');
      sessionStorage.setItem('email', 'qq123456789q@gmail.com');
      sessionStorage.setItem('role', 'admin');
      this.passwordCurrent = true;
    } else {
      if (this.accounts) {
        this.accounts.forEach(val => {
          if (this.accountInfo.user === val.idNum && this.accountInfo.pass === val.password && val.active) {
            sessionStorage.setItem('id', val.id);
            sessionStorage.setItem('name', val.userName);
            sessionStorage.setItem('idNum', val.idNum);
            sessionStorage.setItem('email', val.email);
            sessionStorage.setItem('role', val.role);
            this.passwordCurrent = true;
          }
        });
      }
    }
    if (this.passwordCurrent) {
      this.loginBool.emit(this.accountInfo);
    } else {
      this.accountInfo.user = '';
      this.accountInfo.pass = '';
      this.messageService.clear();
      this.messageService.add({
        key: 'login', life: 2000, severity: 'error', summary: 'Login failed',
        detail: 'Unknown user name or bad password.', closable: false
      });
    }
  }

  // _pass_
  /** 取得所有帳戶資料 */
  getAccount() {
    this.apiService.getData('Patient', '&identifier=NTUTT_LAB1321_patient').subscribe(
      patientData => {
        if (patientData.entry) {
          this.apiService.getData('Practitioner', '&identifier=NTUTT_LAB1321_medic').subscribe(
            medicData => {
              if (medicData.entry) {
                this.serverToview(patientData.entry);
                this.serverToview(medicData.entry);
              }
            }
          );
        }
      }
    );
  }

  // _pass_
  /** 日期字串轉成日期 */
  stringToDate(dateStr: string) {
    const newDate = new Date(dateStr);
    return newDate;
  }

  // _pass_
  /** server資訊轉換為顯示資訊 */
  serverToview(serverData: Array<any>) {
    serverData.forEach((val, i) => {
      if (val.resource.name) {
        val.resource.userName = val.resource.name[0].text;
        val.resource.idNum = val.resource.identifier[0].value;
        val.resource.password = val.resource.identifier[1].value;
        val.resource.role = val.resource.identifier[2].value;
        val.resource.email = val.resource.telecom[0].value;
        val.resource.gender = val.resource.gender;
        val.resource.birth = this.stringToDate(val.resource.birthDate);
        val.resource.status = val.resource.active;
        val.resource.userAddress = val.resource.address[0].text;
        if (val.resource.role === 'doctor' || val.resource.role === 'nurse') {
          val.resource.subject = val.resource.qualification[0].identifier[0].value;
        }
        this.accounts.push(val.resource);
      }
    });
  }

  // _pass_
  pressKey(data: any) {
    if (data.key === 'Enter') {
      this.login();
    }
  }

  // _pass_
  /** 顯示忘記密碼視窗 */
  showForgotPass() {
    this.showForgot = true;
  }

  // _pass_
  /** 確認是否正確並寄Email */
  checkForgot(): boolean {
    for (const val of this.accounts) {
      if (val.email === this.emailForgot && val.idNum === this.accountForgot) {
        const mailObj = new Mail();
        mailObj.acceptMail = this.emailForgot;
        mailObj.title = 'Forgot password notice';
        mailObj.content = 'Dear ' + val.userName + ',\n\n' +
          'this is your password,please keep it safely.\n' +
          'Password: ' + val.password + '\n\n\n\n' +
          'Software Engineering team 4';
        this.apiService.sendMail(mailObj).subscribe();
        this.messageService.clear();
        this.messageService.add({
          key: 'showTopCenter', life: 2000, severity: 'success', summary: 'Check Successfully',
          detail: 'Password have been sent to your mail!'
        });
        this.exitForgot();
        return true;
      }
    }
    this.messageService.clear();
    this.messageService.add({
      key: 'showTopCenter', life: 2000, severity: 'error', summary: 'Check Failed',
      detail: 'Account or Email is not currect!'
    });
    return false;
  }

  // _pass_
  /** 離開忘記密碼視窗 */
  exitForgot() {
    this.showForgot = false;
  }

  // deleteAllPatient() {
  //   // Practitioner
  //   // Patient
  //   this.accounts.forEach(val => {
  //     this.apiService.deleteData('Patient', val.id).subscribe();
  //   });
  // }
}
