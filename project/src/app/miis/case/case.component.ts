import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Account } from 'src/assets/models/account';
import { Medication } from 'src/assets/models/medication';
import { MedicationRequest } from 'src/assets/models/medication_request';
import { MedicalRecord } from 'src/assets/models/medical_record';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css'],
  providers: [MessageService]
})
export class CaseComponent implements OnInit {
  chartSwitch = true;
  /** 病人的單筆資料 */
  patient: Account;
  /** 病人的全部資料 */
  patients: Account[] = [];
  /** 醫生的單筆資料 */
  doctor: Account;
  /** 病例的單筆資料 */
  medicalRecord: MedicalRecord;
  /** 病例的全部資料 */
  medicalRecords: MedicalRecord[] = [];
  /** 藥單的單筆資料 */
  medicationRequest: MedicationRequest;
  /** 藥單的全部資料 */
  medicationRequests: MedicationRequest[] = [];
  /** 藥物的全部資料 */
  medications: Medication[] = [];
  /** 當前使用者資料 */
  currentUser = {
    id: sessionStorage.getItem('id'),
    name: sessionStorage.getItem('name'),
    role: sessionStorage.getItem('role')
  };
  /** 病人列表欄位 */
  patientsCol = [
    { header: 'Name', field: 'userName' },
    { header: 'Id', field: 'idNum' },
    { header: 'Gender', field: 'gender' },
  ];
  /** 個人病例列表欄位 */
  medicalRecordCol = [
    { header: 'Subject', field: 'condition' },
    { header: 'Doctor', field: 'doctorName' },
    { header: 'Date', field: 'date' }
  ];
  /** 症狀欄位 */
  conditionList = [
    { label: 'Sore throat', value: 'Sore throat' },
    { label: 'Muscle ache', value: 'Muscle ache' },
    { label: 'High fever', value: 'High fever' },
    { label: 'H1N1', value: 'H1N1' }
  ];
  /** 判斷 Patient List Loading */
  patientListLoading = false;
  /** 判斷 Record List Loading */
  recordListLoading = false;
  /** 病症Map，用於圖表計數 */
  conditionMap = new Map();
  /** 是否有新增 Medical Record */
  newMedicalRecord: boolean;
  /** 暫存病歷資料 */
  tempRecords = [];
  /** 顯示病例的全部資料 */
  viewRecords: MedicalRecord[] = [];
  /** 是否顯示 Medical Record Detail */
  displayRecordDetail = false;
  /** 圖表資料 */
  chartInfo: any;
  /** 正在被選擇的 Medical Record */
  selectedRecord: MedicalRecord;
  /** 正在被選擇的 Patient */
  selectedPatient: Account;
  /** 是否顯示 Medical Record List */
  displayRecordList: boolean;
  /** 是否顯示圖表 */
  isChartShow = false;
  /** 藥物列表 */
  medicationList: string[] = [];

  constructor(public apiService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  // _pass_
  /** 初始化 */
  ngOnInit() {
    this.patients = [];
    this.medicalRecords = [];
    this.medicalRecord = null;
    this.newMedicalRecord = false;
    this.getPatients();
    this.getMedications();
  }

  // _pass_
  /** 取得 Patient 資料 */
  getPatients() {
    this.patientListLoading = true;
    this.patients = [];
    let filter: string;
    if (this.currentUser.role === 'patient') {
      filter = '&identifier=NTUTT_LAB1321_patient&_id=' + this.currentUser.id;
    } else {
      filter = '&identifier=NTUTT_LAB1321_patient';
    }
    this.apiService.getData('Patient', filter).subscribe(
      patientData => {
        if (patientData.entry) {
          this.patientToview(patientData.entry);
        }
        this.patientListLoading = false;
        this.selectedPatient = null;
      }
    );
  }

  // _pass_
  /** 取得所有藥物資料 */
  getMedications() {
    this.medications = [];
    this.apiService.getData('Medication', '&code=NTUTT_LAB1321').subscribe(
      medications => {
        if (medications.entry) {
          this.medicationsToView(medications.entry);
        }
      }
    );
  }

  // _pass_
  /** 藥物資料轉換格式 */
  medicationsToView(medications: Array<any>) {
    medications.forEach((val, i) => {
      val.resource.name = val.resource.identifier[0].value;
      val.resource.medicForm = val.resource.form.coding[0].code;
      this.medications.push(val.resource);
    });
  }

  // _pass_
  /** 藥物自動完成選項搜尋 */
  searchMedication(event) {
    this.medicationList = [];
    this.medications.forEach(medication => {
      if (medication.name.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.medicationList.push(medication.name);
      }
    });
  }

  // _todo_
  /** 取得 MedicalRecord 資料，並設定圖表 */
  getMedicalRecord() {
    this.recordListLoading = true;
    this.conditionMap = new Map();
    this.medicalRecords = [];
    let filter: string;
    if (this.displayRecordDetail && this.selectedRecord) {
      filter = '&category=NTUTT_LAB1321&_id=' + this.selectedRecord.id;
      this.tempRecords = [];
      this.viewRecords.forEach(val => {
        this.tempRecords.push({ ...val });
      });
    } else {
      filter = '&category=NTUTT_LAB1321&patient=' + this.selectedPatient.id;
      this.viewRecords = [];
    }
    this.apiService.getData('CarePlan', filter).subscribe(
      data => {
        if (data.entry) {
          this.serverToMedicalRecord(data.entry);
        }
        this.recordListLoading = false;
      }
    );
  }

  // _pass_
  /** 選擇 Patient 資料 */
  selectPatient(event) {
    this.displayRecordList = true;
    this.selectedPatient = { ...event.data };
    this.getMedicalRecord();
  }

  // _pass_
  /** 取得 Doctor 的 subject 資料 */
  getDoctorSubject() {
    this.doctor = new Account();
    let filter: string;
    if (this.newMedicalRecord) {
      filter = '&_id=' + this.currentUser.id;
    } else {
      filter = '&_id=' + this.selectedRecord.doctorId;
    }
    this.apiService.getData('Practitioner', filter).subscribe(
      doctorData => {
        if (doctorData.entry) {
          this.subjectToview(doctorData);
        }
      }
    );
  }

  // _pass_
  /** 選擇單筆 Medical Record 資料 */
  selectRecord(event) {
    this.medicationRequests = [];
    this.displayRecordDetail = true;
    this.selectedRecord = { ...event.data };
    this.medicalRecord = this.selectedRecord;
    this.patient = this.selectedPatient;
    this.getDoctorSubject();
    this.getMedicalRecord();
  }

  // _NTD_
  /** 新增一筆 Medical Record */
  addMedicalRecord() {
    this.displayRecordDetail = true;
    this.newMedicalRecord = true;
    const today = new Date();
    this.medicalRecord = new MedicalRecord();
    this.medicalRecord.date = this.dateToString(today);
    this.medicalRecord.doctorId = this.currentUser.id;
    this.medicalRecord.doctorName = this.currentUser.name;
    this.medicalRecord.patientId = this.selectedPatient.id;
    this.getDoctorSubject();
    this.addMedicationRequest();
  }

  // _pass_
  /** 新增處方 */
  addMedicationRequest() {
    this.medicationRequest = new MedicationRequest();
    this.medicationRequests.push(this.medicationRequest);
  }

  // _pass_
  /** 設定圖表內容 */
  setChartInfo() {
    this.chartInfo = {
      labels: ['Sore throat', 'Muscle ache', 'High fever', 'H1N1'],
      datasets: [
        {
          label: 'Conditions of all Records',
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#37eb28'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#37eb28'
          ],
          data: [this.conditionMap.get('Sore throat'), this.conditionMap.get('Muscle ache'),
          this.conditionMap.get('High fever'), this.conditionMap.get('H1N1')]
        }
      ]
    };
  }

  // _todo_
  /** 將 server 資料轉成 MedicalRecord 格式 */
  serverToMedicalRecord(serverData: Array<any>) {
    serverData.forEach((val, i) => {
      if (val.resource.description) {
        if (!this.displayRecordDetail && !this.displayRecordList) {
          this.countConditions(val.resource);
        } else {
          // 獲得 Doctor 名字，用於 Record List 顯示
          const filter = '&_id=' + this.referenceToId(val.resource.author.reference);
          this.apiService.getData('Practitioner', filter).subscribe(
            doctorData => {
              if (doctorData.entry) {
                this.recordDoctorToview(val.resource, doctorData);
              }
              // 將 medicationId, dose, unit 放進處方列表裡，用於顯示病例的處方
              if (this.displayRecordDetail) {
                this.recordMedicationToview(val.resource.activity);
              }
            }
          );
        }
      }
    });
  }

  // _pass_
  /** 將 reference 轉成 id */
  referenceToId(reference: string) {
    return reference.split('/')[1];
  }

  // _todo_
  /** 儲存 Medical Record */
  saveMedicalRecord() {
    if (this.medicalRecord.condition && this.medicalRecord.patientId && this.medicalRecord.doctorId && this.medicationRequests) {
      this.recordListLoading = true;
      this.displayRecordDetail = false;
      this.medicalRecordToServer();
      this.viewRecords = [];
      // 新增病例
      if (this.newMedicalRecord) {
        this.apiService.addData('CarePlan', this.medicalRecord).subscribe(
          data => {
            this.messageService.add({ life: 1500, severity: 'success', summary: 'Save successfully', detail: 'Record is added!' });
            this.medicalRecords.push(this.medicalRecord);
            this.viewRecords = this.medicalRecords;
            this.redirectToRecordList();
          }
        );
      } else {
        // 更新病例
        this.apiService.updateData('CarePlan', this.medicalRecord, this.medicalRecord.id).subscribe(
          data => {
            this.messageService.add({ life: 1500, severity: 'success', summary: 'Save successfully', detail: 'Record is updated!' });
            this.tempRecords.forEach((val, i) => {
              if (val.id === this.selectedRecord.id) {
                this.tempRecords[i] = this.medicalRecord;
                this.medicalRecords = this.tempRecords;
              }
            });
            this.viewRecords = this.medicalRecords;
            this.redirectToRecordList();
          }
        );
      }
    } else {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Save failed', detail: 'Required fields can not be blank!' });
    }
  }

  // _pass_
  /** 跳轉至 Patient List 頁面 */
  redirectToPatientList() {
    this.displayRecordList = false;
    this.isChartShow = false;
    this.medicalRecords = null;
    this.viewRecords = null;
    this.selectedPatient = null;
    this.patientListLoading = false;
    this.getPatients();
  }

  // _pass_
  /** 跳轉至 Record List 頁面 */
  redirectToRecordList() {
    this.displayRecordDetail = false;
    this.newMedicalRecord = false;
    this.selectedRecord = null;
    this.patient = null;
    this.doctor = null;
    this.medicalRecord = null;
    this.recordListLoading = false;
    this.medicationRequests = [];
  }

  // _pass_
  /** 將 MedicalRecord 資料轉成 server 格式 */
  medicalRecordToServer() {
    const subjectObj = { reference: 'Patient/' + this.medicalRecord.patientId };
    const authorObj = { reference: 'Practitioner/' + this.medicalRecord.doctorId };
    const activityObj = [];
    this.medicationRequests.forEach((request, i) => {
      activityObj.push({
        detail: {
          productReference: {
            reference: 'Medication/' + request.medicationId
          },
          dailyAmount: {
            value: request.dose,
            unit: request.unit
          }
        }
      });
    });
    this.medicalRecord.description = this.medicalRecord.condition;
    this.medicalRecord.subject = subjectObj;
    this.medicalRecord.author = authorObj;
    this.medicalRecord.activity = activityObj;
    this.medicalRecord.created = this.medicalRecord.date;
  }

  // _pass_
  /** 日期轉成字串 */
  dateToString(date: Date) {
    const newDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const dateStr = newDate.toISOString().split('T')[0];
    return dateStr;
  }

  // _pass_
  /** 顯示圖表 */
  showChart() {
    this.isChartShow = true;
    this.setChartInfo();
  }

  // _pass_
  /** 選擇藥物 */
  selectMedication(request: any) {
    this.medications.forEach(medication => {
      if (request.medication === medication.name) {
        request.medicationId = medication.id;
        if (medication.medicForm !== 'powder') {
          request.unit = medication.medicForm;
        } else {
          request.unit = 'mg';
        }
      }
    });
  }

  // _pass_
  /** 轉換圖表類型 */
  changeChartType() {
    if (this.chartSwitch === false) {
      this.chartSwitch = true;
    } else {
      this.chartSwitch = false;
    }
  }

  // _pass_
  /** 計算各種 condition 數量，用於產生圖表 */
  countConditions(data: any) {
    if (this.conditionMap.get(data.description) == null) {
      this.conditionMap.set(data.description, 1);
    } else {
      let counter = this.conditionMap.get(data.description);
      counter++;
      this.conditionMap.set(data.description, counter);
    }
  }

  // _pass_
  /** 舊紀錄的醫生資訊轉換為View */
  recordDoctorToview(serverData: any, doctorData: any) {
    const medicalRecords = [...this.medicalRecords];
    serverData.doctorName = doctorData.entry[0].resource.name[0].text;
    serverData.patientId = this.referenceToId(serverData.subject.reference);
    serverData.doctorId = this.referenceToId(serverData.author.reference);
    serverData.date = serverData.created;
    serverData.condition = serverData.description;
    medicalRecords.push(serverData);
    this.medicalRecords = medicalRecords;
    if (!this.displayRecordDetail) {
      this.viewRecords = medicalRecords;
    }
  }

  // _pass_
  /** 舊紀錄的藥物資訊轉換為View */
  recordMedicationToview(data) {
    data.forEach(activity => {
      const request = new MedicationRequest();
      request.medicationId = this.referenceToId(activity.detail.productReference.reference);
      request.dose = activity.detail.dailyAmount.value;
      request.unit = activity.detail.dailyAmount.unit;
      this.medications.forEach(medication => {
        if (request.medicationId === medication.id) {
          request.medication = medication.name;
        }
      });
      this.medicationRequests.push(request);
    });
  }

  // _pass_
  /** 病人資訊轉換為View */
  patientToview(patientData: any) {
    patientData.forEach((val, i) => {
      if (val.resource.active) {
        val.resource.userName = val.resource.name[0].text;
        val.resource.idNum = val.resource.identifier[0].value;
        val.resource.role = val.resource.identifier[2].value;
        this.patients.push(val.resource);
        this.selectedPatient = val.resource;
        this.getMedicalRecord();
      }
    });
  }

  // _pass_
  /** 醫生科別轉換為View */
  subjectToview(doctorData: any) {
    this.doctor.subject = doctorData.entry[0].resource.qualification[0].identifier[0].value;
  }

}
