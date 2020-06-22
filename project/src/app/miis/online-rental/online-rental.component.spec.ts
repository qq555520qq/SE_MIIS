import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineRentalComponent } from './online-rental.component';
import { AppModule } from '../../app.module';
import { By } from '@angular/platform-browser';
import { RentalAppointment } from 'src/assets/models/rentalAppoint';
import { AccountsComponent } from '../accounts/accounts.component';
import { Account } from '../../../assets/models/account';
import { Device } from 'src/assets/models/device';
import { UpdatePass } from '../../../assets/models/updatePass';

describe('OnlineRentalComponent', () => {
  let onlineRental: OnlineRentalComponent;
  let fixture: ComponentFixture<OnlineRentalComponent>;

  const mockServerRental = {
    resource: {
      participant: [
        {actor: {display: 'Tina'}},
        {actor: {display: 'wheelchair'},
         type: [{text: '1'}]},
      ],
      start: '2019-12-20T12:00:00',
      end: '2019-12-27T12:00:00',
      resourceType: 'Appointment',
      status: 'booked',
      reasonCode: [{coding: [{code: 'NTUTT_LAB1321_Rental'}]}]
    }
  };

  const mockRental: RentalAppointment = {
    patientName: 'Tina',
    deviceName: 'wheelchair',
    quantity: '1',
    startDate: new Date(2019, 11, 20),
    endDate: new Date(2019, 11, 27),
    resourceType: 'Appointment',
    participant: [
      {actor: {reference: '', display: ''},
       type: [{text: ''}]},
    ],
    id: '', start: '', end: '', status: 'booked',
    reasonCode: [{coding: [{code: 'NTUTT_LAB1321_Rental'}]}]
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineRentalComponent);
    onlineRental = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    const store = { role: 'patient', name: 'Tina', id: '123' };
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      }
    };
    spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
  });

  describe('Create mail content', async () => {
    it('should create mail content when make rental appointment ', async () =>{
      onlineRental.rental = new RentalAppointment();
      onlineRental.loginEmail = 'test@gmail.com';
      onlineRental.loginUser = 'Tina';
      onlineRental.rental.patientName = 'Tina';
      onlineRental.rental.deviceName = 'wheelChair';
      onlineRental.rental.quantity = '1';
      onlineRental.rental.startDate = new Date(2019, 11, 20);
      onlineRental.rental.endDate = new Date(2019, 11, 27);
      const content = 'Dear Tina,\n\n' +
      'Your device rental application has been accepted.\n' +
      'Please come to get it and return it on time.\n\n\n' +
      'This is the detail information:\n\n' +
      'PatientName: Tina\n' +
      'DeviceName: wheelChair\n' +
      'Quantity: 1\n' +
      'Start: 2019-12-20\n' +
      'End: 2019-12-27\n\n\n\n\n' +
      'Software Engineering team 4';

      const mail = onlineRental.generateMailObj(true);
      expect(mail.acceptMail).toEqual('test@gmail.com');
      expect(mail.title).toEqual('Rental notice');
      expect(mail.content).toEqual(content);
    });

    it('should create mail content when upadte rental appointment ', async () =>{
      onlineRental.rental = new RentalAppointment();
      onlineRental.loginEmail = 'test@gmail.com';
      onlineRental.loginUser = 'Tina';
      onlineRental.rental.patientName = 'Tina';
      onlineRental.rental.deviceName = 'wheelChair';
      onlineRental.rental.quantity = '1';
      onlineRental.rental.startDate = new Date(2019, 11, 20);
      onlineRental.rental.endDate = new Date(2019, 11, 27);
      const content = 'Dear Tina,\n\n' +
      'Your device rental application has been updated.\n' +
      'Please come to get it and return it on time.\n\n\n' +
      'This is the detail information:\n\n' +
      'PatientName: Tina\n' +
      'DeviceName: wheelChair\n' +
      'Quantity: 1\n' +
      'Start: 2019-12-20\n' +
      'End: 2019-12-27\n\n\n\n\n' +
      'Software Engineering team 4';

      const mail = onlineRental.generateMailObj(false);
      expect(mail.acceptMail).toEqual('test@gmail.com');
      expect(mail.title).toEqual('Update an rental notice');
      expect(mail.content).toEqual(content);
    });
  });

  it('should be created', async () => {
    expect(onlineRental).toBeTruthy();
  });

  it('should initialize datas', async () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    spyOn(onlineRental, 'initData').and.callThrough();
    spyOn(onlineRental, 'getDevices').and.callThrough();
    spyOn(onlineRental, 'getRentals').and.callThrough();
    onlineRental.ngOnInit();
    expect(onlineRental.loginRole).toEqual('patient');
    expect(onlineRental.rentDay.getDate()).toEqual(date.getDate());
    expect(onlineRental.initData).toHaveBeenCalled();
    expect(onlineRental.getDevices).toHaveBeenCalled();
    expect(onlineRental.getRentals).toHaveBeenCalled();
  });

  it('should open add-dialog', async () => {
    onlineRental.addRental();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#rental_addDialog'));
    expect(dialog.nativeElement.textContent).toContain('Rental Detail');
    expect(onlineRental.rental.patientName).toContain('Tina');
  });

  it('should close add-dialog', async () => {
    onlineRental.addRental();
    onlineRental.exitRental();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#rental_addDialog'));
    expect(dialog).toEqual(null);
  });

  it('should initialize all variables', async () => {
    onlineRental.initData();
    expect(onlineRental.newRental).toEqual(false);
    expect(onlineRental.rental).toEqual(null);
    expect(onlineRental.selectedRental).toEqual(null);
    expect(onlineRental.tableLoading).toEqual(false);
  });

  it('should convert string to Date', async () => {
    const date = onlineRental.stringToDate('2019-12-05');
    expect(date.getFullYear()).toEqual(2019);
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(5);
  });

  it('should convert Date to string', async () => {
    const dateStr = onlineRental.dateToString(new Date(2019, 11, 5));
    expect(dateStr).toEqual('2019-12-05');
  });

  it('should convert server data to show', async () => {
    onlineRental.rentals = [];
    const start = new Date(2019, 11, 20).getDate();
    const end = new Date(2019, 11, 27).getDate();
    onlineRental.serverToview([mockServerRental]);
    expect(onlineRental.rentals[0].patientName).toEqual('Tina');
    expect(onlineRental.rentals[0].deviceName).toEqual('wheelchair');
    expect(onlineRental.rentals[0].quantity).toEqual('1');
    expect(onlineRental.rentals[0].startDate.getDate()).toEqual(start);
    expect(onlineRental.rentals[0].endDate.getDate()).toEqual(end);
  });

  it('should convert Rental to server form', async () => {
    const participantList = [
      { actor: { reference: 'Patient/123', display: 'Tina' }, type: [{ text: '' }] },
      { actor: { reference: '', display: 'wheelchair' }, type: [{ text: '1' }] }
    ];
    onlineRental.rental = mockRental;
    onlineRental.rentalToServer();
    expect(onlineRental.rental.participant).toEqual(participantList);
    expect(onlineRental.rental.start).toEqual('2019-12-20T00:00:00');
    expect(onlineRental.rental.end).toEqual('2019-12-27T00:00:00');
  });

  it('should set Date of return device', async () => {
    const start = new Date(2019, 11, 20);
    const end = new Date(2019, 11, 27);
    onlineRental.rental = new RentalAppointment();
    onlineRental.rental.endDate = new Date();
    onlineRental.setEndDate(start);
    expect(onlineRental.rental.endDate.getDate()).toEqual(end.getDate());
  });

  it('should open the dialog with selected device appointment', async () => {
    onlineRental.rental = new RentalAppointment();
    onlineRental.onRowSelect({ data: mockRental });
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#rental_addDialog'));
    expect(dialog.nativeElement.textContent).toContain('Rental Detail');
    expect(onlineRental.rental).toEqual(mockRental);
  });
});

describe('OnlineRentalComponent', () => {
  let onlineRental: OnlineRentalComponent;
  let fixture: ComponentFixture<OnlineRentalComponent>;
  let fixtureAccount: ComponentFixture<AccountsComponent>;
  let account: AccountsComponent;

  let patientId: string;
  let rentalId: string;
  let deviceId: string;
  let patientIds: string[] = [];
  let rentalIds: string[] = [];
  let deviceIds: string[] = [];

  const mockRental: RentalAppointment = {
    patientName: 'Tina',
    deviceName: 'wheelchair',
    quantity: '1',
    startDate: new Date(2019, 11, 20),
    endDate: new Date(2019, 11, 27),
    resourceType: 'Appointment',
    participant: [
      {actor: {reference: '', display: ''},
       type: [{text: ''}]},
    ],
    id: '', start: '', end: '', status: 'booked',
    reasonCode: [{coding: [{code: 'NTUTT_LAB1321_Rental'}]}]
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
    fixture = TestBed.createComponent(OnlineRentalComponent);
    onlineRental = fixture.componentInstance;
    fixtureAccount = TestBed.createComponent(AccountsComponent);
    account = fixtureAccount.componentInstance;
    fixture.detectChanges();
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

    /* add mock rental */
    store = { id: patientId };
    spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    onlineRental.rental = mockRental;
    onlineRental.rentalToServer();
    await onlineRental.apiService.addData('Appointment', onlineRental.rental).toPromise().then(
      data => {
        rentalId = data.id;
        rentalIds.push(rentalId);
      }
    );

    /* add mock device */
    const device = new Device();
    device.deviceName = [{ name: 'TestDevice' }];
    await onlineRental.apiService.addData('Device', device).toPromise().then(
      data => {
        deviceId = data.id;
        deviceIds.push(deviceId);

      }
    );
  });

  afterAll(async () => {
    deletePatientRetanl();
    deleteDevice();
  }
  );

  it('should get all devices from server', async () => {
    spyOn(onlineRental.apiService, 'getData').and.callThrough();
    onlineRental.getDevices();
    expect(onlineRental.apiService.getData).toHaveBeenCalled();
  });

  it('should get own rental appointments from server when user is patient', async () => {
    onlineRental.loginRole = 'patient';
    spyOn(onlineRental.apiService, 'getData').and.callThrough();
    onlineRental.getRentals();
    expect(onlineRental.apiService.getData).toHaveBeenCalled();
  });

  it('should get all rental appointments from server when user is not patient', async () => {
    onlineRental.loginRole = 'doctor';
    spyOn(onlineRental.apiService, 'getData').and.callThrough();
    onlineRental.getRentals();
    expect(onlineRental.apiService.getData).toHaveBeenCalled();
  });

  function deletePatientRetanl() {
    rentalIds.forEach((id, i) => {
      onlineRental.apiService.deleteData('Appointment', id).subscribe(
        data => {
          deletePatient(i);
        }
      );
    });
  }

  function deletePatient(index: number) {
    account.apiService.deleteData('Patient', patientIds[index]).subscribe();
  }

  function deleteDevice() {
    deviceIds.forEach((id, i) => {
      onlineRental.apiService.deleteData('Device', id).subscribe();
    });
  }
});
