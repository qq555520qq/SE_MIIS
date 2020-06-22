import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Account } from '../../../assets/models/account';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UpdatePass } from '../../../assets/models/updatePass';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  /** 登入角色 */
  loginRole: string;
  /** 判斷tableLoading完沒 */
  tableLoading = false;
  /** 是否顯示Dialog */
  displayDialog: boolean;
  /** 是否顯示更新密碼視窗 */
  updateDialog: boolean;
  /** 是否顯示密碼 */
  passwordShow: boolean;
  /** 密碼更新物件 */
  updatePassObj: UpdatePass;
  /** 顯示帳號的全部資料 */
  viewAccounts = [];
  /** 帳號的全部資料 */
  accounts: Account[] = [];
  /** 帳號的單筆資料 */
  account: Account;
  /** 帳號欄位 */
  accountCol: any[];
  /** 正在被選擇的帳號資料 */
  selectedAccount: Account;
  /** 是否新增帳號 */
  newAccount: boolean;
  /** 性別列表 */
  genderList = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
  /** 科別列表 */
  subjectList = [
    { label: 'Division of General Medicine', value: 'Division of General Medicine' },
    { label: 'Division of Family Medicine', value: 'Division of Family Medicine' },
    { label: 'Division of Gastroenterology', value: 'Division of Gastroenterology' },
    { label: 'Division of Cardiology', value: 'Division of Cardiology' },
    { label: 'Division of Chest', value: 'Division of Chest' },
    { label: 'Division of Nephrology', value: 'Division of Nephrology' },
    { label: 'Division of Pediatrics', value: 'Division of Pediatrics' }
  ];
  /** 角色列表 */
  roleList: Array<any>;
  /** 現在日期 */
  today = new Date();

  constructor(public apiService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  // _pass_
  ngOnInit() {
    this.loginRole = sessionStorage.getItem('role');
    if (this.loginRole === 'admin') {
      this.roleList = [
        { label: 'Patient', value: 'patient' },
        { label: 'Doctor', value: 'doctor' },
        { label: 'Nurse', value: 'nurse' }
      ];
    } else {
      this.roleList = [
        { label: 'Patient', value: 'patient' }
      ];
    }
    this.viewDecide();
    this.today.getDate();
    this.initData();
    this.getAccounts();
  }

  // _pass_ _opt_
  /** 取得帳號資料 */
  getAccounts() {
    this.tableLoading = true;
    this.viewAccounts = [];
    this.accounts = [];
    let filter: string;
    let roleType: string;
    const loginId = sessionStorage.getItem('id');
    if (this.loginRole === 'doctor' || this.loginRole === 'nurse') {
      roleType = 'Practitioner';
      filter = '&identifier=NTUTT_LAB1321_medic&_id=' + loginId;
      this.apiService.getData(roleType, filter).subscribe(
        ownerData => {
          if (ownerData.entry) {
            roleType = 'Patient';
            filter = '&identifier=NTUTT_LAB1321_patient';
            this.apiService.getData(roleType, filter).subscribe(
              patientData => {
                if (patientData.entry) {
                  this.serverToview(ownerData.entry);
                  this.serverToview(patientData.entry);
                  this.viewAccounts = this.sortByStatus(this.accounts);
                }
              });
          }
          this.tableLoading = false;
        });
    } else if (this.loginRole === 'patient') {
      roleType = 'Patient';
      filter = '&identifier=NTUTT_LAB1321_patient&_id=' + loginId;
      this.apiService.getData(roleType, filter).subscribe(
        data => {
          if (data.entry) {
            this.serverToview(data.entry);
            this.viewAccounts = this.sortByStatus(this.accounts);
          }
          this.tableLoading = false;
        }
      );
    } else if (this.loginRole === 'admin') {
      this.apiService.getData('Patient', '&identifier=NTUTT_LAB1321_patient').subscribe(
        patientData => {
          if (patientData.entry) {
            this.apiService.getData('Practitioner', '&identifier=NTUTT_LAB1321_medic').subscribe(
              medicData => {
                if (medicData.entry) {
                  this.serverToview(patientData.entry);
                  this.serverToview(medicData.entry);
                  this.viewAccounts = this.sortByStatus(this.accounts);
                }
              }
            );
          }
          this.tableLoading = false;
        }
      );

    }
  }

  // _pass_
  /** 照status排序 */
  sortByStatus(list: Array<Account>) {
    const sortList = [];
    const temp = [];
    list.forEach((val, i) => {
      if (val.status) {
        sortList.push(val);
      } else {
        temp.push(val);
      }
    });
    temp.forEach((val, i) => {
      sortList.push(val);
    });
    return sortList;
  }

  // _pass_
  /** 新增帳號 */
  addAccount() {
    this.newAccount = true;
    this.displayDialog = true;
    this.account = new Account();
    this.account.status = true;
    if (this.loginRole === 'doctor' || this.loginRole === 'nurse') {
      this.account.role = 'patient';
    }
  }

  // _pass_ _opt_
  /** 儲存帳號 */
  saveAccount() {
    if (this.account.userName && this.account.idNum && this.account.birth
      && this.account.email && this.account.userAddress && this.account.role
      && ((this.account.role !== 'patient' && this.account.subject) || this.account.role === 'patient')) {
      this.tableLoading = true;
      this.displayDialog = false;
      this.accountToServer();
      this.viewAccounts = [];
      let roleType = 'Practitioner';
      if (this.account.role === 'patient') {
        roleType = 'Patient';
      }
      if (this.newAccount) {
        this.apiService.addData(roleType, this.account).subscribe(
          data => {
            this.messageService.add({ life: 1500, severity: 'success', summary: 'Save successfully', detail: 'Data is saved!' });
            this.account.id = data.id;
            this.accounts.push(this.account);
            this.viewAccounts = this.sortByStatus(this.accounts);
            this.initData();
          }
        );
      } else {
        this.apiService.updateData(roleType, this.account, this.account.id).subscribe(
          data => {
            this.messageService.add({ life: 1500, severity: 'success', summary: 'Save successfully', detail: 'Data is saved!' });
            this.accounts[this.accounts.indexOf(this.selectedAccount)] = this.account;
            this.viewAccounts = this.sortByStatus(this.accounts);
            this.initData();
          }
        );
      }
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 'err', life: 1500, severity: 'error',
        summary: 'Save failed', detail: 'Required fields cannot be blank!'
      });
    }
  }

  // _pass_
  /** 轉換帳號資料成Server格式 */
  accountToServer() {
    const namelist = [
      { text: this.account.userName }
    ];
    const telecomList = [
      { value: this.account.email }
    ];
    const addressList = [
      { text: this.account.userAddress }
    ];
    let roleIdentifier = 'medic';
    if (this.account.role === 'doctor' || this.account.role === 'nurse') {
      const qualificationList = [
        { identifier: [{ value: this.account.subject }] }
      ];
      this.account.qualification = qualificationList;
      this.account.resourceType = 'Practitioner';
    } else {
      this.account.resourceType = 'Patient';
      roleIdentifier = 'patient';
    }
    const identifierList = [
      { value: this.account.idNum },
      { value: this.dateToPassword(this.account.birth) },
      { value: this.account.role },
      { value: 'NTUTT_LAB1321_' + roleIdentifier }
    ];
    this.account.name = namelist;
    this.account.identifier = identifierList;
    this.account.birthDate = this.dateToString(this.account.birth);
    this.account.telecom = telecomList;
    this.account.active = this.account.status;
    this.account.address = addressList;
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
  /** 日期字串轉成日期 */
  stringToDate(dateStr: string) {
    const newDate = new Date(dateStr);
    return newDate;
  }

  // _pass_
  /** 日期轉成字串 */
  dateToString(date: Date) {
    const newDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const dateStr = newDate.toISOString().split('T')[0];
    return dateStr;
  }

  // _pass_
  /** 日期轉成密碼型態 */
  dateToPassword(date: Date) {
    if (this.updatePassObj && this.updatePassObj.newPass) {
      return this.updatePassObj.newPass;
    } else if (this.newAccount) {
      const dateArr = this.dateToString(date).split('-');
      const datePwd = dateArr[1] + dateArr[2];
      return datePwd;
    } else {
      return this.account.password;
    }
  }

  // _pass_
  /** 選擇帳號資料 */
  onRowSelect(event) {
    this.displayDialog = true;
    this.account = { ...event.data };
  }

  // _pass_
  /** 初始化資料 */
  initData() {
    this.newAccount = false;
    this.account = null;
    this.selectedAccount = null;
    this.tableLoading = false;
  }

  // _todo_
  /** 刪除帳號 */
  deleteAccount() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this account?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayDialog = false;
        let roleType = 'Practitioner';
        if (this.account.role === 'patient') {
          roleType = 'Patient';
        }
        this.apiService.deleteData(roleType, this.account.id).subscribe(() => {
          this.messageService.add({ life: 1500, severity: 'success', summary: 'Delete successfully', detail: 'Data is deleted!' });
          this.initData();
          this.getAccounts();
        });
      },
      reject: () => {
        this.displayDialog = false;
        this.initData();
      }
    });
  }

  // _pass_
  /** 使帳號失效 */
  disableAccount() {
    this.account.status = false;
    this.saveAccount();
  }

  // _pass_
  /** 關閉輸入視窗 */
  exitAccount() {
    this.displayDialog = false;
    this.newAccount = false;
    this.account = null;
    this.selectedAccount = null;
  }

  // _pass_
  /** 決定顯示資訊 */
  viewDecide() {
    if (this.loginRole === 'doctor' || this.loginRole === 'nurse' || this.loginRole === 'admin') {
      this.accountCol = [
        { header: 'Name', field: 'userName' },
        { header: 'Id', field: 'idNum' },
        { header: 'Gender', field: 'gender' },
        { header: 'Role', field: 'role' },
        { header: 'Subject', field: 'subject' },
        { header: 'BirthDate', field: 'birth' },
        { header: 'Email', field: 'email' },
        { header: 'Address', field: 'userAddress' }
      ];
    } else {
      this.accountCol = [
        { header: 'Name', field: 'userName' },
        { header: 'Id', field: 'idNum' },
        { header: 'Gender', field: 'gender' },
        { header: 'Role', field: 'role' },
        { header: 'BirthDate', field: 'birth' },
        { header: 'Email', field: 'email' },
        { header: 'Address', field: 'userAddress' }
      ];
    }
  }
  // _pass_
  /** 顯示更改密碼頁面 */
  showUpdatePanal() {
    this.updateDialog = true;
    this.updatePassObj = new UpdatePass();
  }

  // _pass_
  /** 判斷並儲存密碼 */
  saveUpdatePass() {
    let roleType = 'Practitioner';
    if (this.account.role === 'patient') {
      roleType = 'Patient';
    }
    if (this.updatePassObj.oldPass === this.account.password && this.updatePassObj.newPass && this.updatePassObj.confirmPass) {
      if (this.updatePassObj.newPass === this.updatePassObj.confirmPass) {
        this.accountToServer();
        this.apiService.updateData(roleType, this.account, this.account.id).subscribe(
          data => {
            this.displayDialog = false;
            this.selectedAccount = null;
            this.exitUpdatePass();
            this.messageService.add({ life: 2000, severity: 'success', summary: 'Update successfully', detail: 'Password is updated!' });
          }
        );
      } else {
        this.messageService.clear();
        this.messageService.add({
          life: 2000, severity: 'error', summary: 'Update failed',
          detail: 'new Password and confirm Password are not same!'
        });
      }
    } else {
      this.messageService.clear();
      this.messageService.add({
        life: 2000, severity: 'error', summary: 'Update failed',
        detail: 'old Password is not correct or you do not enter password!'
      });
    }
  }

  // _pass_
  /** 離開updatePass頁面 */
  exitUpdatePass() {
    this.updateDialog = false;
    this.updatePassObj = null;
  }
}
