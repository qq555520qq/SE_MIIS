import { Component, OnInit } from '@angular/core';
import { RentalAppointment } from '../../../assets/models/rentalAppoint';
import { Device } from '../../../assets/models/device';
import { ApiService } from '../../api/api.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Mail } from '../../../assets/models/mail';

@Component({
  selector: 'app-online-rental',
  templateUrl: './online-rental.component.html',
  styleUrls: ['./online-rental.component.css']
})
export class OnlineRentalComponent implements OnInit {
  /** 登入角色 */
  loginRole: string;
  /** 登入者的信箱 */
  loginEmail: string;
  /** 登入名稱 */
  loginUser: string;
  /** 是否顯示Dialog */
  displayDialog: boolean;
  /** 租借的全部資料 */
  rentals = [];
  /** 顯示租借的全部資料 */
  viewRentals = [];
  /** 租借的單筆資料 */
  rental: RentalAppointment = new RentalAppointment();
  /** 判斷tableLoading完沒 */
  tableLoading = false;
  /** 租借器材選單 */
  deviceOption = [];
  /** 租借數量選單 */
  quantityOption = [
    { label: '1', value: '1' },
    { label: '2', value: '2' }
  ];
  /** 租借欄位 */
  rentalCol = [
    { header: 'PatientName', field: 'patientName' },
    { header: 'DeviceName', field: 'deviceName' },
    { header: 'Quantity', field: 'quantity' },
    { header: 'StartDate', field: 'startDate' },
    { header: 'EndDate', field: 'endDate' },
    { header: 'Status', field: 'status' }
  ];
  /** 正在被選擇的租借資料 */
  selectedRental: RentalAppointment;
  /** 是否新增租借 */
  newRental: boolean;
  /** 現在時間 */
  today = new Date();
  /** 租借最長日期 */
  rentDay: Date = new Date();

  constructor(public apiService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  // _pass_
  ngOnInit() {
    this.loginRole = sessionStorage.getItem('role');
    this.loginEmail = sessionStorage.getItem('email');
    this.loginUser = sessionStorage.getItem('name');
    this.rentDay.setDate(this.today.getDate() + 7);
    this.initData();
    this.getDevices();
    this.getRentals();
  }

  // _todo_
  /** 取得器材資料 */
  getDevices() {
    this.apiService.getData('Device', '&identifier=NTUTTT_LAB1321').subscribe(
      data => {
        if (data.entry) {
          data.entry.forEach((val) => {
            this.deviceOption.push({ label: val.resource.deviceName[0].name, value: val.resource.deviceName[0].name });
          });
        }
      }
    );
  }

  // _pass_ _opt_
  /** 取得租借資料 */
  getRentals() {
    this.tableLoading = true;
    this.viewRentals = [];
    this.rentals = [];
    let filter: string;
    if (this.loginRole === 'patient') {
      const patientId = sessionStorage.getItem('id');
      filter = '&reason-code=NTUTT_LAB1321_Rental&patient=' + patientId;
    } else {
      filter = '&reason-code=NTUTT_LAB1321_Rental';
    }
    this.apiService.getData('Appointment', filter).subscribe(
      data => {
        if (data.entry) {
          this.serverToview(data.entry);
          this.viewRentals = this.rentals;
        }
        this.tableLoading = false;
      }
    );
  }

  // _pass_
  /** 新增租借資料 */
  addRental() {
    this.newRental = true;
    this.displayDialog = true;
    this.rental = new RentalAppointment();
    this.rental.patientName = sessionStorage.getItem('name');
  }

  // _NTD_
  /** 儲存租借 */
  saveRental() {
    if (this.rental.deviceName && this.rental.endDate && this.rental.quantity) {
      this.tableLoading = true;
      this.displayDialog = false;
      this.rentalToServer();
      const rentals = [...this.viewRentals];
      this.viewRentals = [];
      if (this.newRental) {
        this.apiService.addData('Appointment', this.rental).subscribe(
          data => {
            this.messageService.add({ life: 1500, severity: 'success', summary: 'Save successfully', detail: 'Data is saved!' });
            rentals.push(this.rental);
            this.viewRentals = rentals;
            this.apiService.sendMail(this.generateMailObj(this.newRental)).subscribe();
            this.initData();
          }
        );
      } else {
        this.apiService.updateData('Appointment', this.rental, this.rental.id).subscribe(
          data => {
            this.messageService.add({ life: 1500, severity: 'success', summary: 'Save successfully', detail: 'Data is saved!' });
            rentals[this.rentals.indexOf(this.selectedRental)] = this.rental;
            this.viewRentals = rentals;
            this.apiService.sendMail(this.generateMailObj(this.newRental)).subscribe();
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

  // _todo_
  /** 取消租借 */
  cancelRental() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayDialog = false;
        this.apiService.deleteData('Appointment', this.rental.id).subscribe(() => {
          this.messageService.add({ life: 1500, severity: 'success', summary: 'Delete successfully', detail: 'Data is deleted!' });
          this.initData();
          this.getRentals();
        });
      },
      reject: () => {
        this.displayDialog = false;
        this.initData();
      }
    });
  }

  // _pass_
  /** 關閉租借視窗 */
  exitRental() {
    this.displayDialog = false;
    this.newRental = false;
    this.rental = null;
    this.selectedRental = null;
  }

  // _pass_
  /** 選擇租借資料 */
  onRowSelect(event) {
    this.displayDialog = true;
    this.rental = { ...event.data };
  }

  // _pass_
  /** 初始化資料 */
  initData() {
    this.newRental = false;
    this.rental = null;
    this.selectedRental = null;
    this.tableLoading = false;
  }

  // _pass_
  /** 給予租借七天 */
  setEndDate(date: Date) {
    this.rental.endDate = new Date();
    this.rental.endDate.setDate(date.getDate() + 7);
  }

  // _pass_
  /** 轉換資料成Server格式 */
  rentalToServer() {
    const actorPatient = 'Patient/' + sessionStorage.getItem('id');
    const participantList = [
      { actor: { reference: actorPatient, display: this.rental.patientName }, type: [{ text: '' }] },
      { actor: { reference: '', display: this.rental.deviceName }, type: [{ text: this.rental.quantity }] }
    ];
    this.rental.participant = participantList;
    this.rental.start = this.dateToString(this.rental.startDate) + 'T00:00:00';
    this.rental.end = this.dateToString(this.rental.endDate) + 'T00:00:00';
  }

  // _pass_
  /** server資訊轉換為顯示資訊 */
  serverToview(serverData: Array<any>) {
    serverData.forEach((val, i) => {
      if (val.resource.participant) {
        val.resource.patientName = val.resource.participant[0].actor.display;
        val.resource.deviceName = val.resource.participant[1].actor.display;
        val.resource.quantity = val.resource.participant[1].type[0].text;
        val.resource.startDate = this.stringToDate(val.resource.start.split('T')[0]);
        val.resource.endDate = this.stringToDate(val.resource.end.split('T')[0]);
        this.rentals.push(val.resource);
      }
    });
  }

  // _pass_
  /** 轉換日期字串成日期格式 */
  stringToDate(dateStr: string) {
    const dates = dateStr.split('-');
    const newDate = new Date();
    newDate.setFullYear(Number(dates[0]), Number(dates[1]) - 1, Number(dates[2]));
    return newDate;
  }

  // _pass_
  /** 轉換日期成日期字串 */
  dateToString(convertDate: Date): string {
    let dateStr = '';
    dateStr = dateStr + convertDate.getFullYear().toString() + '-';
    if (convertDate.getMonth() + 1 < 10) {
      dateStr = dateStr + '0' + (convertDate.getMonth() + 1).toString() + '-';
    } else {
      dateStr = dateStr + (convertDate.getMonth() + 1).toString() + '-';
    }
    if (convertDate.getDate() < 10) {
      dateStr = dateStr + '0' + convertDate.getDate().toString();
    } else {
      dateStr = dateStr + convertDate.getDate().toString();
    }
    return dateStr;
  }

  // _NTD_
  /** 新增器材資料 */
  addDevice(deviceName: string) {
    const device = new Device();
    device.deviceName = [{ name: deviceName }];
    this.apiService.addData('Device', device).subscribe();
  }

  // _pass_
  /** 產生Mail物件 */
  generateMailObj(isNew: boolean): Mail {
    const mailObj = new Mail();
    if (isNew) {
      mailObj.acceptMail = this.loginEmail;
      mailObj.title = 'Rental notice';
      mailObj.content = 'Dear ' + this.loginUser + ',\n\n' +
        'Your device rental application has been accepted.\n' +
        'Please come to get it and return it on time.\n\n\n' +
        'This is the detail information:\n\n' +
        'PatientName: ' + this.rental.patientName + '\n' +
        'DeviceName: ' + this.rental.deviceName + '\n' +
        'Quantity: ' + this.rental.quantity + '\n' +
        'Start: ' + this.dateToString(this.rental.startDate) + '\n' +
        'End: ' + this.dateToString(this.rental.endDate) + '\n\n\n\n\n' +
        'Software Engineering team 4';
      return mailObj;
    } else {
      mailObj.acceptMail = this.loginEmail;
      mailObj.title = 'Update an rental notice';
      mailObj.content = 'Dear ' + this.loginUser + ',\n\n' +
        'Your device rental application has been updated.\n' +
        'Please come to get it and return it on time.\n\n\n' +
        'This is the detail information:\n\n' +
        'PatientName: ' + this.rental.patientName + '\n' +
        'DeviceName: ' + this.rental.deviceName + '\n' +
        'Quantity: ' + this.rental.quantity + '\n' +
        'Start: ' + this.dateToString(this.rental.startDate) + '\n' +
        'End: ' + this.dateToString(this.rental.endDate) + '\n\n\n\n\n' +
        'Software Engineering team 4';
      return mailObj;
    }
  }
}
