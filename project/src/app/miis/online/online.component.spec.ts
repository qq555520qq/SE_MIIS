import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { OnlineComponent } from './online.component';
import { AppModule } from '../../app.module';
import { By } from '@angular/platform-browser';
import { Appointment } from '../../../assets/models/appointment';
import { Account } from '../../../assets/models/account';
import { AccountsComponent } from '../accounts/accounts.component';
import { UpdatePass } from '../../../assets/models/updatePass';
import { Observable } from 'rxjs';
import { HttpBackend } from '@angular/common/http';

describe('OnlineComponent', () => {
  let fixture: ComponentFixture<OnlineComponent>;
  let appointment: OnlineComponent;
  let fixtureAccount: ComponentFixture<AccountsComponent>;
  let account: AccountsComponent;

  const mockPatientAppointment = {
    id: '580577', name: 'Patient', idNum: 'C123456789', date: new Date(2019, 11, 20),
    time: '22:00:00', subject: 'Division of General Medicine', doctor: 'Dr.Mark',
    location: 'A101', resourceType: 'Appointment', identifier: [{ value: '' }], status: 'booked',
    specialty: [{ text: '' }], reasonCode: [{ coding: [{ code: 'NTUTT_LAB1321' }] }], start: '',
    participant: [{ actor: { reference: '', display: '' } }]
  };

  const mockServerPatientAppointment = [{
    resource: {
      participant: [
        { actor: { display: 'Tina' } },
        { actor: { display: 'Dr.Mark' } },
        { actor: { display: 'A101' } },
      ],
      identifier: [{ value: 'K123456789' }],
      start: '2019-12-21T22:00:00',
      specialty: [{ text: 'Division of General Medicine' }]
    }
  }];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineComponent);
    appointment = fixture.componentInstance;
    fixtureAccount = TestBed.createComponent(AccountsComponent);
    account = fixtureAccount.componentInstance;
    fixture.detectChanges();
    fixtureAccount.detectChanges();
  });

  beforeEach(() => {
    const store = { name: 'Tina', idNum: 'K123456789', role: 'patient', id: '580577' };
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      }
    };
    spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
  });

  describe('Create mail content', async () => {
    it('should create mail content when make appointment ', async () => {
      appointment.appoint = new Appointment();
      appointment.loginEmail = 'test@gmail.com';
      appointment.loginUser = 'Tina';
      appointment.appoint.name = 'Tina';
      appointment.appoint.subject = 'testSubject';
      appointment.appoint.doctor = 'Dr.Mark';
      appointment.appoint.date = new Date(2019, 11, 20);
      appointment.appoint.time = '12:00:00';
      appointment.appoint.location = 'A101';
      const content = 'Dear Tina,\n\n' +
        'You have already made an appointment successfully.\n' +
        'Please arrive on time.\n\n\n' +
        'This is the detail information:\n\n' +
        'Name: Tina\n' +
        'Subject: testSubject\n' +
        'Doctor: Dr.Mark\n' +
        'Date: 2019-12-20\n' +
        'Time: Morning diagnosis(09:00~12:00)\n' +
        'Location: A101\n\n\n\n\n' +
        'Software Engineering team 4';

      const mail = appointment.generateMailObj(true);
      expect(mail.acceptMail).toEqual('test@gmail.com');
      expect(mail.title).toEqual('Appointment notice');
      expect(mail.content).toEqual(content);
    });

    it('should create mail content when update appointment ', async () => {
      appointment.appoint = new Appointment();
      appointment.loginEmail = 'test@gmail.com';
      appointment.loginUser = 'Tina';
      appointment.appoint.name = 'Tina';
      appointment.appoint.subject = 'testSubject';
      appointment.appoint.doctor = 'Dr.Mark';
      appointment.appoint.date = new Date(2019, 11, 20);
      appointment.appoint.time = '12:00:00';
      appointment.appoint.location = 'A101';
      const content = 'Dear Tina,\n' +
        'You have already update an appointment successfully.\n' +
        'Please arrive on time.\n\n\n' +
        'This is the detail information:\n\n' +
        'Name: Tina\n' +
        'Subject: testSubject\n' +
        'Doctor: Dr.Mark\n' +
        'Date: 2019-12-20\n' +
        'Time: Morning diagnosis(09:00~12:00)\n' +
        'Location: A101\n\n\n\n\n' +
        'Software Engineering team 4';

      const mail = appointment.generateMailObj(false);
      expect(mail.acceptMail).toEqual('test@gmail.com');
      expect(mail.title).toEqual('Update an appointment notice');
      expect(mail.content).toEqual(content);
    });
  });

  it('should be created', async () => {
    expect(appointment).toBeTruthy();
  });

  it('should open add-dialog', async () => {
    appointment.addAppointment();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#appointment_addDialog'));
    expect(dialog.nativeElement.textContent).toContain('Appointment Detail');
    expect(appointment.appoint.name).toEqual('Tina');
    expect(appointment.appoint.idNum).toEqual('K123456789');
  });

  it('should close add-dialog', async () => {
    appointment.exitAppointment();
    // fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#appointment_addDialog'));
    expect(dialog).toEqual(null);
  });

  it('should initialize all variables', async () => {
    appointment.initData();
    expect(appointment.newAppointment).toEqual(false);
    expect(appointment.isHaveSubject).toEqual(false);
    expect(appointment.isHaveDoctor).toEqual(false);
    expect(appointment.appoint).toEqual(null);
    expect(appointment.selectedAppointment).toEqual(null);
    expect(appointment.tableLoading).toEqual(false);
  });

  it('should convert string to Date', async () => {
    const date = appointment.stringToDate('2019-12-05');
    expect(date.getFullYear()).toEqual(2019);
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(5);
  });

  it('should convert Date to string', async () => {
    const dateStr = appointment.dateToString(new Date(2019, 11, 5));
    expect(dateStr).toEqual('2019-12-05');
  });

  it('should convert time to show', async () => {
    const morning = '12:00:00';
    const afternoon = '17:00:00';
    const night = '22:00:00';
    let result = '';
    result = appointment.timeToview(morning);
    expect(result).toEqual('Morning diagnosis(09:00~12:00)');
    result = appointment.timeToview(afternoon);
    expect(result).toEqual('Afternoon diagnosis(14:00~17:00)');
    result = appointment.timeToview(night);
    expect(result).toEqual('Night diagnosis(19:00~22:00)');
  });

  it('should be able to input fields with pre-condition', async () => {
    appointment.appoint = new Appointment();
    spyOn(appointment, 'getSubjectDoctors').and.callThrough();
    appointment.appoint.subject = 'Division of General Medicine';
    appointment.dataChange();
    expect(appointment.getSubjectDoctors).toHaveBeenCalled();
    expect(appointment.isHaveSubject).toEqual(true);

    appointment.appoint.doctor = 'Dr.Tina';
    appointment.dataChange();
    expect(appointment.isHaveDoctor).toEqual(true);

    appointment.appoint.date = new Date(2019, 12, 20);
    appointment.dataChange();
    expect(appointment.isHaveDate).toEqual(true);

    appointment.appoint.time = '12:00:00';
    appointment.newAppointment = true;
    appointment.dataChange();
    expect(appointment.locations).toContain(appointment.appoint.location);
  });

  it('should open the dialog with selected appointment data', async () => {
    spyOn(appointment, 'dataChange').and.callThrough();
    appointment.appoint = new Appointment();
    appointment.onRowSelect({ data: mockPatientAppointment });
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#appointment_addDialog'));
    expect(dialog.nativeElement.textContent).toContain('Appointment Detail');
    expect(appointment.appoint.name).toEqual('Patient');
    expect(appointment.appoint.idNum).toEqual('C123456789');
    expect(appointment.appoint.date).toEqual(new Date(2019, 11, 20));
    expect(appointment.appoint.time).toEqual('22:00:00');
    expect(appointment.appoint.subject).toEqual('Division of General Medicine');
    expect(appointment.appoint.doctor).toEqual('Dr.Mark');
    expect(appointment.appoint.location).toEqual('A101');
  });

  it('should convert Appointment to server form', async () => {
    appointment.appoint = mockPatientAppointment;
    const participantList = [
      { actor: { reference: 'Patient/580577', display: 'Patient' } },
      { actor: { reference: '', display: 'Dr.Mark' } },
      { actor: { reference: '', display: 'A101' } }
    ];
    const identifierList = [{ value: 'C123456789' }];
    const specialtyList = [{ text: 'Division of General Medicine' }];
    appointment.appointmentToServer();
    expect(appointment.appoint.participant).toEqual(participantList);
    expect(appointment.appoint.identifier).toEqual(identifierList);
    expect(appointment.appoint.specialty).toEqual(specialtyList);
    expect(appointment.appoint.start).toEqual('2019-12-20T22:00:00');
  });

  it('should convert server data to show', async () => {
    appointment.serverToview(mockServerPatientAppointment);
    expect(appointment.appoints[0].name).toEqual('Tina');
    expect(appointment.appoints[0].idNum).toEqual('K123456789');
    expect(appointment.appoints[0].date.getDate()).toEqual(new Date('2019-12-21').getDate());
    expect(appointment.appoints[0].time).toEqual('22:00:00');
    expect(appointment.appoints[0].subject).toEqual('Division of General Medicine');
    expect(appointment.appoints[0].doctor).toEqual('Dr.Mark');
    expect(appointment.appoints[0].location).toEqual('A101');
  });
});

describe('OnlineComponent_FHIR API', () => {
  let fixture: ComponentFixture<OnlineComponent>;
  let appointment: OnlineComponent;
  let fixtureAccount: ComponentFixture<AccountsComponent>;
  let account: AccountsComponent;

  let patientId: string;
  let doctorId: string;
  let appointmentId: string;
  let patientIds: string[] = [];
  let doctorIds: string[] = [];
  let appointmentIds: string[] = [];

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

  const mockAppointment: Appointment = {
    id: '', name: 'Patient', idNum: 'C123456789', date: new Date(2019, 11, 20),
    time: '22:00:00', subject: 'Division of General Medicine', doctor: 'Doctor',
    location: 'A101', resourceType: 'Appointment', identifier: [{ value: '' }], status: 'booked',
    specialty: [{ text: '' }], reasonCode: [{ coding: [{ code: 'NTUTT_LAB1321' }] }], start: '',
    participant: [{ actor: { reference: '', display: '' } }]
  };

  let store: object;
  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    }
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineComponent);
    appointment = fixture.componentInstance;
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

    /* add mock appointment */
    store = { id: patientId };
    spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    appointment.appoint = mockAppointment;
    appointment.appointmentToServer();
    await appointment.apiService.addData('Appointment', appointment.appoint).toPromise().then(
      data => {
        appointmentId = data.id;
        appointmentIds.push(appointmentId);
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
  });

  afterAll(async () => {
    deletePatientAppointment();
    deleteDoctor();
  });

  describe('Delete appointment', () => {
    it('should open the confirm-dialog', async () => {
      appointment.appoint = mockAppointment;
      appointment.cancelAppointment();
      fixture.detectChanges();
      const confirmDialog = fixture.debugElement.query(By.css('.ui-dialog-title')).nativeElement;
      expect(confirmDialog).toBeTruthy();
      expect(confirmDialog.textContent).toContain('Delete Confirmation');
    });

    it('should close the confirm-dialog when reject delete', async () => {
      spyOn(appointment, 'initData').and.callThrough();
      appointment.appoint = mockAppointment;
      appointment.cancelAppointment();
      fixture.detectChanges();
      const rejectBtn = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[1].nativeElement;
      rejectBtn.click();
      fixture.detectChanges();
      const confirmDialog = fixture.debugElement.query(By.css('.ui-dialog-title'));
      expect(confirmDialog).toEqual(null);
      expect(appointment.initData).toHaveBeenCalled();
    });

    it('should close the confirm-dialog when accpet delete', async () => {
      appointment.appoint = mockAppointment;
      appointment.appoint.id = appointmentIds.pop();
      appointment.cancelAppointment();
      fixture.detectChanges();
      const acceptBtn = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[0].nativeElement;
      acceptBtn.click();
      fixture.detectChanges();
      const confirmDialog = fixture.debugElement.query(By.css('.ui-dialog-title'));
      expect(confirmDialog).toEqual(null);
    });
  });

  it('should initialize datas', async () => {
    /* mock sessionStorage */
    store = {role: 'patient', email: 'patient@gmail.com', name: 'Patient'};
    const appointDay = new Date();
    appointDay.setDate(appointDay.getDate() + 30);
    spyOn(appointment, 'initData').and.callThrough();
    spyOn(appointment, 'getPractitioner').and.callThrough();
    spyOn(appointment, 'getAppointments').and.callThrough();

    appointment.ngOnInit();
    expect(appointment.initData).toHaveBeenCalled();
    expect(appointment.getPractitioner).toHaveBeenCalled();
    expect(appointment.getAppointments).toHaveBeenCalled();
    expect(appointment.loginRole).toEqual('patient');
    expect(appointment.loginEmail).toEqual('patient@gmail.com');
    expect(appointment.loginUser).toEqual('Patient');
    expect(appointment.appointDay.getDate()).toEqual(appointDay.getDate());
  });

  it('should get all practitioners\' data', async () => {
    spyOn(appointment.apiService, 'getData').and.callThrough();
    appointment.getPractitioner();
    expect(appointment.apiService.getData).toHaveBeenCalled();
  });

  it('should get all doctors data', async () => {
    const mockServerMedicAccount = [{
      resource: {
        name: [{ text: 'Chucky' }],
        identifier: [
          { value: 'A123456789' },
          { value: '0922' },
          { value: 'doctor' }
        ],
        telecom: [{ value: 'chucky@gmail.com' }],
        gender: 'male',
        birthDate: '1996-09-22',
        active: true,
        address: [{ text: 'Lab1321' }],
        qualification: [{ identifier: [{ value: 'Division of General Medicine' }] }],
        userName: '', email: '', userAddress: '', role: '', subject: '', resourceType: '', idNum: '',
        birth: new Date(), id: '', password: '', status: true
      }
    }];

    const mockMedicAccount = {
      name: [{ text: 'Chucky' }],
      identifier: [
        { value: 'A123456789' },
        { value: '0922' },
        { value: 'doctor' }
      ],
      telecom: [{ value: 'chucky@gmail.com' }],
      gender: 'male',
      birthDate: '1996-09-22',
      active: true,
      address: [{ text: 'Lab1321' }],
      qualification: [{ identifier: [{ value: 'Division of General Medicine' }] }],
      userName: '', email: '', userAddress: '', role: '', subject: '', resourceType: '', idNum: '',
      birth: new Date(), id: '', password: '', status: true
    };

    const subject = {
      label: 'Division of General Medicine',
      value: 'Division of General Medicine'
    };
    appointment.appointSubjects = [];
    appointment.doctors = [];
    appointment.getDoctorsInfos(mockServerMedicAccount);
    expect(appointment.appointSubjects[0]).toEqual(subject);
    expect(appointment.doctors[0]).toEqual(mockMedicAccount);
  });

  it('should get doctors\' data of each subject', async () => {
    const mockMedicAccount1: Account = {
      name: [{ text: 'Chucky' }],
      identifier: [
        { value: 'A123456789' },
        { value: '0922' },
        { value: 'doctor' }
      ],
      telecom: [{ value: 'chucky@gmail.com' }],
      gender: 'male',
      birthDate: '1996-09-22',
      active: true,
      address: [{ text: 'Lab1321' }],
      qualification: [{ identifier: [{ value: 'Division of General Medicine' }] }],
      id: '', userName: '', idNum: '', password: '', birth: new Date(), email: '',
      status: true, userAddress: '', role: '', subject: '', resourceType: ''
    };

    const mockMedicAccount2: Account = {
      name: [{ text: 'Mark' }],
      identifier: [
        { value: 'T123456789' },
        { value: '1010' },
        { value: 'doctor' }
      ],
      telecom: [{ value: 'mark@gmail.com' }],
      gender: 'male',
      birthDate: '1995-10-10',
      active: true,
      address: [{ text: 'Lab1322' }],
      qualification: [{ identifier: [{ value: 'Division of Chest' }] }],
      id: '', userName: '', idNum: '', password: '', birth: new Date(), email: '',
      status: true, userAddress: '', role: '', subject: '', resourceType: ''
    };

    const mockDoctors = [{
      label: 'Chucky',
      value: 'Chucky'
    }];

    appointment.appointDoctors = [];

    appointment.doctors = [
      mockMedicAccount1,
      mockMedicAccount2
    ];

    appointment.appoint = new Appointment();
    appointment.appoint.subject = 'Division of General Medicine';
    appointment.getSubjectDoctors();
    expect(appointment.appointDoctors).toEqual(mockDoctors);
  });

  it('should get appointments from server', async () => {
    appointment.loginRole = 'patient';
    appointment.appoints = [];
    spyOn(appointment.apiService, 'getData').and.callThrough();
    appointment.getAppointments();
    expect(appointment.apiService.getData).toHaveBeenCalled();
  });

  function deletePatientAppointment() {
    appointmentIds.forEach((id, i) => {
      appointment.apiService.deleteData('Appointment', id).subscribe(
        data => {
          deletePatient(i);
        }
      );
    });

  }

  function deletePatient(index: number) {
    account.apiService.deleteData('Patient', patientIds[index]).subscribe();
  }

  function deleteDoctor() {
    doctorIds.forEach((id, i) => {
      account.apiService.deleteData('Practitioner', id).subscribe();
    });
  }
});
