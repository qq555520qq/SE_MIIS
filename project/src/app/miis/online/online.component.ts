import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Appointment } from '../../../assets/models/appointment';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Account } from '../../../assets/models/account';
import { Mail } from '../../../assets/models/mail';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {
  /** 登入角色 */
  loginRole: string;
  /** 登入者的信箱 */
  loginEmail: string;
  /** 登入名稱 */
  loginUser: string;
  /** 是否顯示Dialog */
  displayDialog: boolean;
  /** 預約的全部資料 */
  appoints = [];
  /** 顯示預約的全部資料 */
  viewAppoints = [];
  /** 預約的單筆資料 */
  appoint: Appointment = new Appointment();
  /** 判斷tableLoading完沒 */
  tableLoading = false;
  /** 預約欄位 */
  appointCol = [
    { header: 'Name', field: 'name' },
    { header: 'Identity number', field: 'idNum' },
    { header: 'Subject', field: 'subject' },
    { header: 'Doctor', field: 'doctor' },
    { header: 'Date', field: 'date' },
    { header: 'Time', field: 'time' },
    { header: 'Location', field: 'location' },
    { header: 'Status', field: 'status' }
  ];
  /** 預約時間選單 */
  appointTimes = [
    { label: 'Morning diagnosis(09:00~12:00)', value: '12:00:00' },
    { label: 'Afternoon diagnosis(14:00~17:00)', value: '17:00:00' },
    { label: 'Night diagnosis(19:00~22:00)', value: '22:00:00' }
  ];
  /** 看診地點 */
  locations = ['A101', 'B205', 'B106', 'A102', 'B301', 'A202', 'B201', 'A402'];
  /** 預約科別 */
  appointSubjects = [];
  /** 預約醫生 */
  appointDoctors = [];
  /** 醫生總資訊 */
  doctors: Account[] = [];
  /** 正在被選擇的預約資料 */
  selectedAppointment: Appointment;
  /** 是否新增預約 */
  newAppointment: boolean;
  /** 現在時間 */
  today = new Date();
  /** 預約最長日期 */
  appointDay: Date = new Date();
  /** 是否有科別資料 */
  isHaveSubject = false;
  /** 是否有醫生資料 */
  isHaveDoctor = false;
  /** 是否有日期資料 */
  isHaveDate = false;
  appointment: {};

  constructor(public apiService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  // _pass_
  ngOnInit() {
    this.loginRole = sessionStorage.getItem('role');
    this.loginEmail = sessionStorage.getItem('email');
    this.loginUser = sessionStorage.getItem('name');
    this.appointDay.setDate(this.today.getDate() + 30);
    this.initData();
    this.getPractitioner();
    this.getAppointments();
  }

  // _pass_
  /** 取得預約資料 */
  getAppointments() {
    this.tableLoading = true;
    this.viewAppoints = [];
    this.appoints = [];
    let filter: string;
    if (this.loginRole === 'patient') {
      const patientId = sessionStorage.getItem('id');
      filter = '&reason-code=NTUTT_LAB1321&patient=' + patientId;
    } else {
      filter = '&reason-code=NTUTT_LAB1321';
    }
    this.apiService.getData('Appointment', filter).subscribe(
      data => {
        if (data.entry) {
          this.serverToview(data.entry);
          this.viewAppoints = this.appoints;
        }
        this.tableLoading = false;
      }
    );
  }

  // _pass_
  /** 取得全部醫生資料 */
  getPractitioner() {
    this.apiService.getData('Practitioner', '&identifier=NTUTT_LAB1321_medic').subscribe(
      doctorData => {
        if (doctorData) {
          this.getDoctorsInfos(doctorData.entry);
        }
      }
    );
  }

  // _pass_
  /** 取得全部醫生資訊 */
  getDoctorsInfos(doctorData: Array<any>) {
    doctorData.forEach(val => {
      if (val.resource.identifier[2].value === 'doctor') {
        const duplicatedNum = this.appointSubjects.filter(sub => sub.label === val.resource.qualification[0].identifier[0].value).length;
        if (duplicatedNum === 0) {
          const subject = {
            label: val.resource.qualification[0].identifier[0].value,
            value: val.resource.qualification[0].identifier[0].value
          };
          this.appointSubjects.push(subject);
        }
        this.doctors.push(val.resource);
      }
    });
  }

  // _pass_
  /** 取得特定科別醫生資訊 */
  getSubjectDoctors() {
    this.appointDoctors = [];
    const subjectDoctors = this.doctors.filter(val => val.qualification[0].identifier[0].value === this.appoint.subject);
    subjectDoctors.forEach(val => {
      const doctor = { label: val.name[0].text, value: val.name[0].text };
      this.appointDoctors.push(doctor);
    });
  }

  // _pass_
  /** 新增預約資料 */
  addAppointment() {
    this.newAppointment = true;
    this.displayDialog = true;
    this.appoint = new Appointment();
    this.appoint.name = sessionStorage.getItem('name');
    this.appoint.idNum = sessionStorage.getItem('idNum');
  }

  // _pass_
  /** 儲存預約 */
  saveAppointment() {
    if (this.appoint.idNum && this.appoint.subject && this.appoint.doctor && this.appoint.date && this.appoint.time) {
      this.displayDialog = false;
      this.tableLoading = true;
      this.appointmentToServer();
      this.appoints = [...this.viewAppoints];
      this.viewAppoints = [];
      if (this.newAppointment) {
        this.apiService.addData('Appointment', this.appoint).subscribe(
          data => {
            this.messageService.add({ life: 1500, severity: 'success', summary: 'Save successfully', detail: 'Data is saved!' });
            this.appoints.push(this.appoint);
            this.viewAppoints = this.appoints;
            this.apiService.sendMail(this.generateMailObj(this.newAppointment)).subscribe();
            this.initData();
          }
        );
      } else {
        this.apiService.updateData('Appointment', this.appoint, this.appoint.id).subscribe(
          data => {
            this.messageService.add({ life: 1500, severity: 'success', summary: 'Save successfully', detail: 'Data is saved!' });
            this.appoints[this.appoints.indexOf(this.selectedAppointment)] = this.appoint;
            this.viewAppoints = this.appoints;
            this.apiService.sendMail(this.generateMailObj(this.newAppointment)).subscribe();
            this.initData();
          }
        );
      }
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 'err', life: 1500, severity: 'error',
        summary: 'Save failed', detail: 'Required fields can not be blank!'
      });
    }
  }

  // _pass_
  /** 取消預約 */
  cancelAppointment() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayDialog = false;
        this.apiService.deleteData('Appointment', this.appoint.id).subscribe(() => {
          this.messageService.add({ life: 1500, severity: 'success', summary: 'Delete successfully', detail: 'Data is deleted!' });
          this.initData();
          this.getAppointments();
        });
      },
      reject: () => {
        this.displayDialog = false;
        this.initData();
      }
    });
  }

  // _pass_
  /** 關閉預約視窗 */
  exitAppointment() {
    this.displayDialog = false;
    this.newAppointment = false;
    this.appoint = null;
    this.selectedAppointment = null;
    this.isHaveSubject = false;
    this.isHaveDoctor = false;
  }

  // _pass_
  /** 判斷資料是否改變 */
  dataChange() {
    if (this.appoint.subject) {
      this.getSubjectDoctors();
      this.isHaveSubject = true;
    }
    if (this.appoint.doctor) {
      this.isHaveDoctor = true;
    }
    if (this.appoint.date) {
      this.isHaveDate = true;
    }
    if (this.appoint.time && this.newAppointment) {
      this.appoint.location = this.locations[Math.floor(Math.random() * this.locations.length)];
    }
  }

  // _pass_
  /** 選擇預約資料 */
  onRowSelect(event) {
    this.displayDialog = true;
    this.appoint = { ...event.data };
    this.dataChange();
  }

  // _pass_
  /** 初始化資料 */
  initData() {
    this.newAppointment = false;
    this.isHaveSubject = false;
    this.isHaveDoctor = false;
    this.appoint = null;
    this.selectedAppointment = null;
    this.tableLoading = false;
  }

  // _pass_
  /** 轉換資料成Server格式 */
  appointmentToServer() {
    const actorPatient = 'Patient/' + sessionStorage.getItem('id');
    const participantList = [
      { actor: { reference: actorPatient, display: this.appoint.name } },
      { actor: { reference: '', display: this.appoint.doctor } },
      { actor: { reference: '', display: this.appoint.location } }
    ];
    const identifierList = [
      { value: this.appoint.idNum }
    ];
    const specialtyList = [
      { text: this.appoint.subject }
    ];
    this.appoint.participant = participantList;
    this.appoint.identifier = identifierList;
    this.appoint.specialty = specialtyList;
    this.appoint.start = this.dateToString(this.appoint.date) + 'T' + this.appoint.time;
  }


  // _pass_
  /** server資訊轉換為顯示資訊 */
  serverToview(serverData: Array<any>) {
    serverData.forEach((val, i) => {
      if (val.resource.participant) {
        val.resource.name = val.resource.participant[0].actor.display;
        val.resource.idNum = val.resource.identifier[0].value;
        val.resource.date = this.stringToDate(val.resource.start.split('T')[0]);
        val.resource.time = val.resource.start.split('T')[1];
        val.resource.subject = val.resource.specialty[0].text;
        val.resource.doctor = val.resource.participant[1].actor.display;
        val.resource.location = val.resource.participant[2].actor.display;
        this.appoints.push(val.resource);
      }
    });
  }

  // _pass_
  /** 轉換時間成時間區間顯示 */
  timeToview(str: string): string {
    let resultStr: string;
    this.appointTimes.forEach(val => {
      if (val.value === str) {
        resultStr = val.label;
      }
    });
    return resultStr;
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
  dateToString(convertDate: Date) {
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

  // _pass_
  /** 產生Mail物件 */
  generateMailObj(isNew: boolean): Mail {
    const mailObj = new Mail();
    if (isNew) {
      mailObj.acceptMail = this.loginEmail;
      mailObj.title = 'Appointment notice';
      mailObj.content = 'Dear ' + this.loginUser + ',\n\n' +
        'You have already made an appointment successfully.\n' +
        'Please arrive on time.\n\n\n' +
        'This is the detail information:\n\n' +
        'Name: ' + this.appoint.name + '\n' +
        'Subject: ' + this.appoint.subject + '\n' +
        'Doctor: ' + this.appoint.doctor + '\n' +
        'Date: ' + this.dateToString(this.appoint.date) + '\n' +
        'Time: ' + this.timeToview(this.appoint.time) + '\n' +
        'Location: ' + this.appoint.location + '\n\n\n\n\n' +
        'Software Engineering team 4';
      return mailObj;
    } else {
      mailObj.acceptMail = this.loginEmail;
      mailObj.title = 'Update an appointment notice';
      mailObj.content = 'Dear ' + this.loginUser + ',\n' +
        'You have already update an appointment successfully.\n' +
        'Please arrive on time.\n\n\n' +
        'This is the detail information:\n\n' +
        'Name: ' + this.appoint.name + '\n' +
        'Subject: ' + this.appoint.subject + '\n' +
        'Doctor: ' + this.appoint.doctor + '\n' +
        'Date: ' + this.dateToString(this.appoint.date) + '\n' +
        'Time: ' + this.timeToview(this.appoint.time) + '\n' +
        'Location: ' + this.appoint.location + '\n\n\n\n\n' +
        'Software Engineering team 4';
      return mailObj;
    }
  }

  // deleteAllOnile() {
  //   this.appoints.forEach(val => {
  //     this.apiService.deleteData('Appointment', val.id).subscribe();
  //   });
  // }
}


