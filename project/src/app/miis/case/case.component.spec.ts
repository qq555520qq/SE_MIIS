import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseComponent } from './case.component';
import { AppModule } from '../../app.module';
import { Account } from '../../../assets/models/account';
import { By } from '@angular/platform-browser';
import { MedicalRecord } from 'src/assets/models/medical_record';
import { MedicationRequest } from 'src/assets/models/medication_request';
import { Medication } from 'src/assets/models/medication';
import { AccountsComponent } from '../accounts/accounts.component';
import { UpdatePass } from 'src/assets/models/updatePass';

describe('CaseComponent', () => {
  let record: CaseComponent;
  let fixture: ComponentFixture<CaseComponent>;

  const mockPatient: Account = {
    userName: 'Patient',
    email: 'patient@gmail.com',
    userAddress: 'Lab1323',
    role: 'patient',
    subject: '',
    resourceType: '',
    idNum: 'K123456789',
    birth: new Date(1996, 9, 10),
    id: '',
    password: '1010',
    status: true,
    name: [{ text: '' }],
    identifier: [
      { value: '' },
      { value: '' },
      { value: '' }
    ],
    telecom: [{ value: '' }],
    gender: 'male',
    birthDate: '',
    active: true,
    address: [{ text: '' }],
    qualification: [{ identifier: [{ value: '' }] }]
  };

  const mockMedicRequest: MedicationRequest = {
    medicationId: '456',
    medication: 'testMedication',
    dose: 2,
    unit: 'mg',
    id: '', resourceType: 'MedicationRequest', medicationReference: { reference: '' },
    dosageInstruction: { text: '' }, reasonCode: [{ coding: [{ code: 'NTUTT_LAB1321' }] }]
  };

  const mockRecord: MedicalRecord = {
    patientId: '12345',
    doctorId: '54321',
    condition: 'TestCondition',
    date: '2019-12-20',
    id: '', doctorName: 'Doctor', medicationIds: [], doses: [0], units: ['mg'], resourceType: 'NTUTT_LAB1321', created: '',
    description: '', subject: { reference: '' }, author: { reference: '' }, category: [{ coding: [{ code: '' }] }],
    activity: [{ detail: { productReference: { reference: '' }, dailyAmount: { value: 0, unit: '' } } }]
  };

  const mockChartInfo = {
    labels: ['Sore throat', 'Muscle ache', 'High fever', 'H1N1'],
    datasets: [
      {
        label: 'Conditions of all Records',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#37eb28'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#37eb28'],
        data: [2, 6, 3, 1]
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseComponent);
    record = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', async () => {
    expect(record).toBeTruthy();
  });

  it('should set chart infomation', async () => {
    record.chartInfo = '';
    record.conditionMap = new Map([['Sore throat', 2], ['Muscle ache', 6], ['High fever', 3], ['H1N1', 1]]);
    record.setChartInfo();
    expect(record.chartInfo.labels).toEqual(mockChartInfo.labels);
    expect(record.chartInfo.datasets[0].label).toEqual(mockChartInfo.datasets[0].label);
    expect(record.chartInfo.datasets[0].backgroundColor).toEqual(mockChartInfo.datasets[0].backgroundColor);
    expect(record.chartInfo.datasets[0].hoverBackgroundColor).toEqual(mockChartInfo.datasets[0].hoverBackgroundColor);
    expect(record.chartInfo.datasets[0].data).toEqual(mockChartInfo.datasets[0].data);
  });

  it('should get referecre id', async () => {
    const id = record.referenceToId('Patient/12345');
    expect(id).toEqual('12345');
  });

  it('should convert Date to string', async () => {
    const dateStr = record.dateToString(new Date(2019, 11, 5));
    expect(dateStr).toEqual('2019-12-05');
  });

  it('should convert Record to server form', async () => {
    const subjectObj = { reference: 'Patient/12345' };
    const authorObj = { reference: 'Practitioner/54321' };
    const activityObj = { detail: { productReference: { reference: 'Medication/456' }, dailyAmount: { value: 2, unit: 'mg' } } };

    record.medicalRecord = mockRecord;
    record.medicationRequests = [mockMedicRequest];
    record.medicalRecordToServer();
    expect(record.medicalRecord.description).toEqual(record.medicalRecord.condition);
    expect(record.medicalRecord.subject).toEqual(subjectObj);
    expect(record.medicalRecord.author).toEqual(authorObj);
    expect(record.medicalRecord.activity[0]).toEqual(activityObj);
    expect(record.medicalRecord.created).toEqual(record.medicalRecord.date);
  });

  it('should show record chart', async () => {
    record.chartInfo = mockChartInfo;
    spyOn(record, 'setChartInfo').and.callThrough();
    record.showChart();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#chart_dialog'));
    expect(dialog.nativeElement.textContent).toContain('Medical Record Chart');
    expect(record.setChartInfo).toHaveBeenCalled();
  });

  it('should get all medications\' name', async () => {
    const mockEvent = { query: 'a' };
    record.medications = [new Medication(), new Medication()];
    record.medicationList = [];
    /* medication */
    record.medications[0].name = 'testMedication';
    record.medications[0].id = 'M123';
    record.medications[0].medicForm = 'powder';
    record.medications[1].name = 'ABCMedication';
    record.medications[1].id = 'M124';
    record.medications[1].medicForm = 'powder';

    record.searchMedication(mockEvent);
    expect(record.medicationList[0]).toEqual('ABCMedication');
  });

  it('should add new formula', async () => {
    record.medicationRequest = new MedicationRequest();
    record.medicationRequests = [];
    const len = record.medicationRequests.length;

    record.addMedicationRequest();
    const lenAdd = record.medicationRequests.length;
    expect(len + 1).toEqual(lenAdd);
  });

  it('should convert medication to show', async () => {
    const mockData: Medication = {
      identifier: [{ value: 'testData' }],
      form: { coding: [{ code: 'tablets' }], text: '' },
      code: [{ coding: [{ code: 'NTUTT_LAB1321' }] }],
      id: '', name: '', medicForm: '', description: '', resourceType: 'Medication',
    };

    record.medications = [];
    record.medicationsToView([{ resource: mockData }]);
    expect(record.medications[0]).toEqual(mockData);
  });

  it('should calculate total number of condition', async () => {
    const mockData = { description: 'Hi' };
    record.conditionMap = new Map();
    record.countConditions(mockData);
    expect(record.conditionMap.get('Hi')).toEqual(1);
    record.countConditions(mockData);
    expect(record.conditionMap.get('Hi')).toEqual(2);
  });

  it('should convert doctor to view', async () => {
    const mockServerRecord = {
      subject: { reference: '/12345' },
      author: { reference: '/54321' },
      created: '2019-12-20',
      description: 'Hi',
      doctorName: '',
      patientId: '',
      doctorId: '',
      date: '',
      condition: ''
    };
    const mockDoctor = {
      entry: [{ resource: { name: [{ text: 'Dr.Tina' }] } }]
    };
    const mockAns = {
      subject: { reference: '/12345' },
      author: { reference: '/54321' },
      created: '2019-12-20',
      description: 'Hi',
      doctorName: 'Dr.Tina',
      patientId: '12345',
      doctorId: '54321',
      date: '2019-12-20',
      condition: 'Hi',
    };
    record.displayRecordDetail = false;
    record.medicalRecords = [];
    record.viewRecords = [];
    record.recordDoctorToview(mockServerRecord, mockDoctor);
    expect(record.viewRecords[0]).toEqual(mockAns);
  });

  it('should convert Medcations of record to show', async () => {
    const mockData = {
      detail: {
        productReference: {
          reference: '/12345'
        },
        dailyAmount: {
          value: 1,
          unit: 'tablets'
        }
      }
    };

    const mockMedic = new Medication();
    mockMedic.id = '12345';
    mockMedic.name = 'testMedic';
    record.medications = [mockMedic];
    record.recordMedicationToview([mockData]);
    expect(record.medicationRequests[0].medicationId).toEqual('12345');
    expect(record.medicationRequests[0].dose).toEqual(1);
    expect(record.medicationRequests[0].unit).toEqual('tablets');
    expect(record.medicationRequests[0].medication).toEqual('testMedic');
  });

  it('should convert Doctor\'s subject to show', async () => {
    const mockData = {entry: [{resource: {qualification: [{identifier: [{value: 'testSubject'}]}]}}]};
    record.doctor = new Account();
    record.subjectToview(mockData);
    expect(record.doctor.subject).toEqual('testSubject');
  });

  it('should redirect to Record page', async () => {
    record.selectedPatient = new Account();
    record.redirectToRecordList();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#record_detail_dialog'));
    expect(dialog).toEqual(null);
  });

  describe('should be able to switch chart', async () => {
    it('should show bar-chart', () => {
      record.chartInfo = mockChartInfo;
      record.isChartShow = true;
      record.chartSwitch = true;
      record.changeChartType();
      fixture.detectChanges();
      const chart = fixture.debugElement.query(By.css('#chart_dialog'));
      const barChart = chart.query(By.css('#barChart')).nativeElement;
      expect(barChart).toBeTruthy();
    });

    it('should show pie-chart', () => {
      record.chartInfo = mockChartInfo;
      record.isChartShow = true;
      record.chartSwitch = false;
      record.changeChartType();
      fixture.detectChanges();
      const chart = fixture.debugElement.query(By.css('#chart_dialog'));
      const pieChart = chart.query(By.css('#pieChart')).nativeElement;
      expect(pieChart).toBeTruthy();
    });
  });

  describe('should select medications\' unit automatically', async () => {
    it('should not select unit \'mg\'', () => {
      record.medications = [new Medication()];
      const mockMedic = new MedicationRequest();
      /* medication */
      record.medications[0].name = 'testMedication';
      record.medications[0].id = 'M123';
      record.medications[0].medicForm = 'tablets';
      /* medication request*/
      mockMedic.medication = 'testMedication';
      mockMedic.medicationId = '';
      mockMedic.unit = '';

      record.selectMedication(mockMedic);
      expect(mockMedic.medicationId).toEqual('M123');
      expect(mockMedic.unit).toEqual('tablets');
    });

    it('should select unit \'mg\'', () => {
      record.medications = [new Medication()];
      const mockMedic = new MedicationRequest();
      /* medication */
      record.medications[0].name = 'testMedication';
      record.medications[0].id = 'M123';
      record.medications[0].medicForm = 'powder';

      /* medication request*/
      mockMedic.medication = 'testMedication';
      mockMedic.medicationId = '';
      mockMedic.unit = '';

      record.selectMedication(mockMedic);
      expect(mockMedic.medicationId).toEqual('M123');
      expect(mockMedic.unit).toEqual('mg');
    });
  });
});

describe('CaseComponent_FHIR API', async () => {
  let record: CaseComponent;
  let fixture: ComponentFixture<CaseComponent>;
  let account: AccountsComponent;
  let fixtureAccount: ComponentFixture<AccountsComponent>;

  let patientId: string;
  let doctorId: string;
  let recordId: string;
  let medicId: string;
  let patientIds: string[] = [];
  let doctorIds: string[] = [];
  let recordIds: string[] = [];
  let medicIds: string[] = [];


  const mockDoctor: Account = {
    userName: 'Doctor',
    email: 'doctor@gmail.com',
    userAddress: 'Lab1321',
    role: 'doctor',
    subject: 'Division of General Medicine',
    resourceType: '',
    idNum: 'A123456789',
    birth: new Date(1996, 8, 22),
    id: '',
    password: '0922',
    status: true,
    name: [{ text: '' }],
    identifier: [
      { value: '' },
      { value: '' },
      { value: '' }
    ],
    telecom: [{ value: '' }],
    gender: 'male',
    birthDate: '',
    active: true,
    address: [{ text: '' }],
    qualification: [{ identifier: [{ value: '' }] }]
  };

  const mockPatient: Account = {
    userName: 'Patient',
    email: 'patient@gmail.com',
    userAddress: 'Lab1323',
    role: 'patient',
    subject: '',
    resourceType: '',
    idNum: 'K123456789',
    birth: new Date(1996, 9, 10),
    id: '',
    password: '1010',
    status: true,
    name: [{ text: '' }],
    identifier: [
      { value: '' },
      { value: '' },
      { value: '' }
    ],
    telecom: [{ value: '' }],
    gender: 'male',
    birthDate: '',
    active: true,
    address: [{ text: '' }],
    qualification: [{ identifier: [{ value: '' }] }]
  };

  const mockRecord: MedicalRecord = {
    patientId: '',
    doctorId: '',
    condition: 'TestCondition',
    date: '2019-12-20',
    id: '', doctorName: 'Doctor', medicationIds: [], doses: [0], units: ['mg'], resourceType: 'CarePlan', created: '',
    description: '', subject: { reference: '' }, author: { reference: '' }, category: [{ coding: [{ code: 'NTUTT_LAB1321' }] }],
    activity: [{ detail: { productReference: { reference: '' }, dailyAmount: { value: 0, unit: '' } } }]
  };

  const mockMedic: Medication = {
  id: '', name: '', medicForm: '', description: '', resourceType: 'Medication',
  identifier: [{value: 'testMedication'}], form: {coding: [{code: 'powder'}], text: 'fever'},
  code: [{coding: [{code: 'NTUTT_LAB1321'}]}]
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseComponent);
    record = fixture.componentInstance;
    fixtureAccount = TestBed.createComponent(AccountsComponent);
    account = fixtureAccount.componentInstance;
    fixture.detectChanges();
    fixtureAccount.detectChanges();
    account.updatePassObj = new UpdatePass();
  });

  beforeEach(async () => {
    /* add mock patient */
    account.account = mockPatient;
    account.updatePassObj.newPass = '';
    account.accountToServer();
    await account.apiService.addData('Patient', account.account).toPromise().then(
      data => {
        patientId = data.id;
        patientIds.push(patientId);
      }
    );

    /* add mock doctor */
    account.account = mockDoctor;
    account.updatePassObj.newPass = '';
    account.accountToServer();
    await account.apiService.addData('Practitioner', account.account).toPromise().then(
      data => {
        doctorId = data.id;
        doctorIds.push(doctorId);
      }
    );

    /* add mock medic */
    await record.apiService.addData('Medication', mockMedic).toPromise().then(
      data => {
        medicId = data.id;
        medicIds.push(medicId);
      }
    );

    /* add mock record */
    record.medicalRecord = mockRecord;
    record.medicalRecord.patientId = patientId;
    record.medicalRecord.doctorId = doctorId;
    record.medicalRecordToServer();
    await record.apiService.addData('CarePlan', record.medicalRecord).toPromise().then(
      data => {
        recordId = data.id;
        recordIds.push(recordId);
      }
    );
  });

  afterAll(async () => {
    deleteRecord();
    deleteMedic();
    deleteDoctor();
    deletePatient();
  });

  it('should show patients\' records when select row', async () => {
    const obj = { data: mockPatient };
    spyOn(record, 'getMedicalRecord').and.callThrough();
    record.selectedRecord = mockRecord;
    record.selectedPatient = mockPatient;
    record.selectedPatient.id = patientId;
    record.selectPatient(obj);
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#account_records_dialog'));
    expect(dialog.nativeElement.textContent).toContain('Medical Record List');
    expect(record.selectedPatient).toEqual(mockPatient);
    expect(record.getMedicalRecord).toHaveBeenCalled();
  });

  it('should initialize data', async () => {
    spyOn(record, 'getPatients').and.callThrough();
    spyOn(record, 'getMedications').and.callThrough();
    record.ngOnInit();
    expect(record.patients).toEqual([]);
    expect(record.medicalRecords).toEqual([]);
    expect(record.medicalRecord).toEqual(null);
    expect(record.newMedicalRecord).toEqual(false);
    expect(record.getPatients).toHaveBeenCalled();
    expect(record.getMedications).toHaveBeenCalled();
  });

  it('should redirect to Patient page', async () => {
    spyOn(record, 'getPatients').and.callThrough();
    record.selectedPatient = new Account();
    record.redirectToPatientList();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#patient_table'));
    expect(dialog.nativeElement.textContent).toContain('Medical Record Management');
    expect(record.getPatients).toHaveBeenCalled();
  });

  it('should open record-detail-dialog', async () => {
    spyOn(record, 'getDoctorSubject').and.callThrough();
    spyOn(record, 'getMedicalRecord').and.callThrough();
    const obj = { data: mockRecord };
    obj.data.id = medicId;
    record.selectedPatient = mockPatient;

    record.selectRecord(obj);
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#record_detail_dialog'));
    expect(dialog.nativeElement.textContent).toContain('Medical Record');
    expect(record.medicalRecord).toEqual(mockRecord);
    expect(record.patient).toEqual(mockPatient);
    expect(record.selectedPatient).toEqual(mockPatient);
    expect(record.getDoctorSubject).toHaveBeenCalled();
    expect(record.getMedicalRecord).toHaveBeenCalled();
  });

  it('should get patients\' account', async () => {
    const mockUser = {id: patientId, name: 'Patient', role: 'patient'};
    record.patients = [];
    record.currentUser = mockUser;
    spyOn(record.apiService, 'getData').and.callThrough();
    record.getPatients();
    expect(record.apiService.getData).toHaveBeenCalled();
  });

  it('should get all medications', async () => {
    record.medications = [];
    spyOn(record.apiService, 'getData').and.callThrough();
    record.getMedications();
    expect(record.apiService.getData).toHaveBeenCalled();
  });

  it('should get all medications when there is new records', async () => {
    const mockUser = { id: 'K123456789', name: 'Patient', role: 'patient' };
    record.newMedicalRecord = true;
    record.currentUser = mockUser;
    spyOn(record.apiService, 'getData').and.callThrough();
    record.getDoctorSubject();
    expect(record.apiService.getData).toHaveBeenCalled();
  });

  it('should get all medications when there is new records', async () => {
    record.newMedicalRecord = false;
    record.selectedRecord = mockRecord;
    record.selectedRecord.doctorId = doctorId;
    spyOn(record.apiService, 'getData').and.callThrough();
    record.getDoctorSubject();
    expect(record.apiService.getData).toHaveBeenCalled();
  });

  it('should convert Patient to show', async () => {
    const mockServerPatient: Account = {
      userName: '',
      email: '',
      userAddress: '',
      role: '',
      subject: '',
      resourceType: '',
      idNum: '',
      birth: new Date(),
      id: '',
      password: '',
      status: true,
      name: [{ text: 'Patient' }],
      identifier: [
        { value: 'K123456789' },
        { value: '' },
        { value: 'patient' }
      ],
      telecom: [{ value: '' }],
      gender: '',
      birthDate: '',
      active: true,
      address: [{ text: '' }],
      qualification: [{ identifier: [{ value: '' }] }]
    };
    record.patients = [];
    record.patient = mockServerPatient;
    record.patient.id = patientId;
    spyOn(record, 'getMedicalRecord').and.callThrough();

    record.patientToview([{resource: mockServerPatient}]);
    expect(record.patients[0].userName).toEqual('Patient');
    expect(record.patients[0].idNum).toEqual('K123456789');
    expect(record.patients[0].role).toEqual('patient');
    expect(record.selectedPatient).toEqual(mockServerPatient);
    expect(record.getMedicalRecord).toHaveBeenCalled();
  });

  function deletePatient() {
    patientIds.forEach((id, i) => {
      account.apiService.deleteData('Patient', id).subscribe();
    });
  }

  function deleteDoctor() {
    doctorIds.forEach((id, i) => {
      account.apiService.deleteData('Practitioner', id).subscribe();
    });
  }

  function deleteRecord() {
    recordIds.forEach((id, i) => {
      record.apiService.deleteData('CarePlan', id).subscribe();
    });
  }

  function deleteMedic() {
    medicIds.forEach((id, i) => {
      record.apiService.deleteData('Medication', id).subscribe();
    });
  }
});
