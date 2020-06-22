import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsComponent } from './accounts.component';
import { AppModule } from '../../app.module';
import { By } from '@angular/platform-browser';
import { Account } from '../../../assets/models/account';
import { UpdatePass } from '../../../assets/models/updatePass';

describe('AccountsComponent', () => {
  let account: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

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

  const mockNurse: Account = {
    userName: 'Nurse',
    email: 'nurse@gmail.com',
    userAddress: 'Lab1322',
    role: 'nurse',
    subject: 'Division of General Medicine',
    resourceType: '',
    idNum: 'T123456789',
    birth: new Date(1997, 7, 7),
    id: '',
    password: '0807',
    status: true,
    name: [{ text: '' }],
    identifier: [
      { value: '' },
      { value: '' },
      { value: '' }
    ],
    telecom: [{ value: '' }],
    gender: 'female',
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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsComponent);
    account = fixture.componentInstance;
    fixture.detectChanges();
    account.updatePassObj = new UpdatePass();
    account.account = new Account();
    account.accounts = [];
  });

  describe('Convert Date to password', () => {
    it('should convert Date to origin password form', async () => {
      account.updatePassObj.newPass = '';
      account.newAccount = true;
      const dateStr = account.dateToPassword(new Date(2019, 11, 5));
      expect(dateStr).toEqual('1205');
    });

    it('should convert Date to changed password form', async () => {
      account.updatePassObj.newPass = 'hello';
      const dateStr = account.dateToPassword(new Date(2019, 11, 5));
      expect(dateStr).toEqual('hello');
    });

    it('should convert fail', async () => {
      account.account.password = '123';
      account.updatePassObj.newPass = '';
      account.newAccount = false;
      const dateStr = account.dateToPassword(new Date(2019, 11, 5));
      expect(dateStr).toEqual('123');
    });
  });

  describe('Open add-account dialog', () => {
    it('should open add-account dialog with doctor', async () => {
      account.loginRole = 'doctor';
      account.addAccount();
      fixture.detectChanges();
      const dialog = fixture.debugElement.query(By.css('#account_addDialog'));
      expect(dialog.nativeElement.textContent).toContain('Account Detail');
      expect(account.account.role).toEqual('patient');
    });

    it('should open add-account dialog with nurse', async () => {
      account.loginRole = 'nurse';
      account.addAccount();
      fixture.detectChanges();
      const dialog = fixture.debugElement.query(By.css('#account_addDialog'));
      expect(dialog.nativeElement.textContent).toContain('Account Detail');
      expect(account.account.role).toEqual('patient');
    });

  });

  describe('Show different column', () => {
    const patient = [
      { header: 'Name', field: 'userName' },
      { header: 'Id', field: 'idNum' },
      { header: 'Gender', field: 'gender' },
      { header: 'Role', field: 'role' },
      { header: 'BirthDate', field: 'birth' },
      { header: 'Email', field: 'email' },
      { header: 'Address', field: 'userAddress' }
    ];

    const other = [
      { header: 'Name', field: 'userName' },
      { header: 'Id', field: 'idNum' },
      { header: 'Gender', field: 'gender' },
      { header: 'Role', field: 'role' },
      { header: 'Subject', field: 'subject' },
      { header: 'BirthDate', field: 'birth' },
      { header: 'Email', field: 'email' },
      { header: 'Address', field: 'userAddress' }
    ];

    it('should show column without subject when user is patient', async () => {
      account.loginRole = 'patient';
      account.viewDecide();
      fixture.detectChanges();
      expect(account.accountCol).toEqual(patient);
    });

    it('should show column with subject when user is doctor', async () => {
      account.loginRole = 'doctor';
      account.viewDecide();
      fixture.detectChanges();
      expect(account.accountCol).toEqual(other);
    });

    it('should show column with subject when user is nurse', async () => {
      account.loginRole = 'nurse';
      account.viewDecide();
      fixture.detectChanges();
      expect(account.accountCol).toEqual(other);
    });

    it('should show column with subject when user is admin', async () => {
      account.loginRole = 'admin';
      account.viewDecide();
      fixture.detectChanges();
      expect(account.accountCol).toEqual(other);
    });
  });

  describe('Convert server data to show', () => {
    const mockServerDoctorAccount = [{
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
        qualification: [{ identifier: [{ value: 'Division of General Medicine' }] }]
      }
    }];

    const mockServerNurseAccount = [{
      resource: {
        name: [{ text: 'Tina' }],
        identifier: [
          { value: 'K123456789' },
          { value: '0807' },
          { value: 'nurse' }
        ],
        telecom: [{ value: 'tina@gmail.com' }],
        gender: 'female',
        birthDate: '1997-08-07',
        active: true,
        address: [{ text: 'Lab1322' }],
        qualification: [{ identifier: [{ value: 'Division of General Medicine' }] }]
      }
    }];

    it('should convert server data to show with docter', async () => {
      account.serverToview(mockServerDoctorAccount);
      expect(account.accounts[0].userName).toEqual('Chucky');
      expect(account.accounts[0].idNum).toEqual('A123456789');
      expect(account.accounts[0].password).toEqual('0922');
      expect(account.accounts[0].role).toEqual('doctor');
      expect(account.accounts[0].email).toEqual('chucky@gmail.com');
      expect(account.accounts[0].gender).toEqual('male');
      expect(account.accounts[0].birth).toEqual(account.stringToDate('1996-09-22'));
      expect(account.accounts[0].status).toEqual(true);
      expect(account.accounts[0].userAddress).toEqual('Lab1321');
      expect(account.accounts[0].subject).toEqual('Division of General Medicine');
    });

    it('should convert server data to show with nurse', async () => {
      account.serverToview(mockServerNurseAccount);
      expect(account.accounts[0].userName).toEqual('Tina');
      expect(account.accounts[0].idNum).toEqual('K123456789');
      expect(account.accounts[0].password).toEqual('0807');
      expect(account.accounts[0].role).toEqual('nurse');
      expect(account.accounts[0].email).toEqual('tina@gmail.com');
      expect(account.accounts[0].gender).toEqual('female');
      expect(account.accounts[0].birth).toEqual(account.stringToDate('1997-08-07'));
      expect(account.accounts[0].status).toEqual(true);
      expect(account.accounts[0].userAddress).toEqual('Lab1322');
      expect(account.accounts[0].subject).toEqual('Division of General Medicine');
    });
  });

  describe('Convert Account to server', () => {
    it('should convert doctor Account to server form', async () => {
      account.account = mockDoctor;
      const namelist = [{ text: 'Doctor' }];
      const telecomList = [{ value: 'doctor@gmail.com' }];
      const addressList = [{ text: 'Lab1321' }];
      const qualificationList = [{ identifier: [{ value: 'Division of General Medicine' }] }];
      const identifierList = [
        { value: 'A123456789' },
        { value: '0922' },
        { value: 'doctor' },
        { value: 'NTUTT_LAB1321_medic' }
      ];
      account.accountToServer();
      expect(account.account.name).toEqual(namelist);
      expect(account.account.identifier).toEqual(identifierList);
      expect(account.account.birthDate).toEqual('1996-09-22');
      expect(account.account.telecom).toEqual(telecomList);
      expect(account.account.active).toEqual(true);
      expect(account.account.address).toEqual(addressList);
      expect(account.account.qualification).toEqual(qualificationList);
      expect(account.account.resourceType).toEqual('Practitioner');
    });

    it('should convert nurse Account to server form', async () => {
      account.account = mockNurse;
      const namelist = [{ text: 'Nurse' }];
      const telecomList = [{ value: 'nurse@gmail.com' }];
      const addressList = [{ text: 'Lab1322' }];
      const qualificationList = [{ identifier: [{ value: 'Division of General Medicine' }] }];
      const identifierList = [
        { value: 'T123456789' },
        { value: '0807' },
        { value: 'nurse' },
        { value: 'NTUTT_LAB1321_medic' }
      ];
      account.accountToServer();
      expect(account.account.name).toEqual(namelist);
      expect(account.account.identifier).toEqual(identifierList);
      expect(account.account.birthDate).toEqual('1997-08-07');
      expect(account.account.telecom).toEqual(telecomList);
      expect(account.account.active).toEqual(true);
      expect(account.account.address).toEqual(addressList);
      expect(account.account.qualification).toEqual(qualificationList);
      expect(account.account.resourceType).toEqual('Practitioner');
    });

    it('should convert patient Account to server form', async () => {
      account.account = mockPatient;
      const namelist = [{ text: 'Patient' }];
      const telecomList = [{ value: 'patient@gmail.com' }];
      const addressList = [{ text: 'Lab1323' }];
      const identifierList = [
        { value: 'K123456789' },
        { value: '1010' },
        { value: 'patient' },
        { value: 'NTUTT_LAB1321_patient' }
      ];
      account.accountToServer();
      expect(account.account.name).toEqual(namelist);
      expect(account.account.identifier).toEqual(identifierList);
      expect(account.account.birthDate).toEqual('1996-10-10');
      expect(account.account.telecom).toEqual(telecomList);
      expect(account.account.active).toEqual(true);
      expect(account.account.address).toEqual(addressList);
      expect(account.account.resourceType).toEqual('Patient');
    });
  });

  it('should be created', async () => {
    expect(account).toBeTruthy();
  });

  it('should initialize data with admin', async () => {
    const store = {
      role: 'admin', name: 'Admin', idNum: 'L123456789',
      email: 'qq123456789q@gmail.com'
    };
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      }
    };
    const adminList = [
      { label: 'Patient', value: 'patient' },
      { label: 'Doctor', value: 'doctor' },
      { label: 'Nurse', value: 'nurse' }
    ];

    spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(account, 'initData').and.callThrough();
    spyOn(account, 'getAccounts').and.callThrough();
    spyOn(account, 'viewDecide').and.callThrough();

    account.ngOnInit();
    expect(account.viewDecide).toHaveBeenCalled();
    expect(account.initData).toHaveBeenCalled();
    expect(account.getAccounts).toHaveBeenCalled();
    expect(account.roleList).toEqual(adminList);
  });

  it('should convert string to Date', async () => {
    const date = account.stringToDate('2019-12-05');
    expect(date.getFullYear()).toEqual(2019);
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(5);
  });

  it('should convert Date to string', async () => {
    const dateStr = account.dateToString(new Date(2019, 11, 5));
    expect(dateStr).toEqual('2019-12-05');
  });

  it('should initialize all variables', async () => {
    account.initData();
    expect(account.newAccount).toEqual(false);
    expect(account.account).toEqual(null);
    expect(account.selectedAccount).toEqual(null);
    expect(account.tableLoading).toEqual(false);
  });

  it('should close add-account dialog', async () => {
    account.exitAccount();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#account_addDialog'));
    expect(dialog).toEqual(null);
  });

  it('should sort account by status', async () => {
    const mockAccount: Account[] = [];
    while (true) {
      mockAccount.push(new Account());
      if (mockAccount.length >= 5) {
        break;
      }
    }
    mockAccount[0].userName = '1';
    mockAccount[0].status = true;
    mockAccount[1].userName = '2';
    mockAccount[1].status = false;
    mockAccount[2].userName = '3';
    mockAccount[2].status = false;
    mockAccount[3].userName = '4';
    mockAccount[3].status = true;
    mockAccount[4].userName = '5';
    mockAccount[4].status = false;

    const result = account.sortByStatus(mockAccount);
    expect(result[0].userName).toEqual('1');
    expect(result[1].userName).toEqual('4');
    expect(result[2].userName).toEqual('2');
    expect(result[3].userName).toEqual('3');
    expect(result[4].userName).toEqual('5');
  });

  it('should show account detail when select row', async () => {
    const obj = { data: mockPatient };
    account.onRowSelect(obj);
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#account_addDialog'));
    expect(dialog.nativeElement.textContent).toContain('Account Detail');
    expect(account.account).toEqual(mockPatient);
  });

  it('should make account disable', async () => {
    spyOn(account, 'saveAccount').and.callThrough();
    account.account.status = true;
    account.disableAccount();
    fixture.detectChanges();
    expect(account.account.status).toEqual(false);
    expect(account.saveAccount).toHaveBeenCalled();
  });

  it('should open forget password panel', async () => {
    account.showUpdatePanal();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#update_password'));
    expect(dialog.nativeElement.textContent).toContain('Update Password');
  });

  it('should close forget password panel', async () => {
    account.exitUpdatePass();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#update_password'));
    expect(dialog).toEqual(null);
  });
});

describe('AccountsComponent_FHIR API', () => {
  let account: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

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

  const mockNurse: Account = {
    userName: 'Nurse',
    email: 'nurse@gmail.com',
    userAddress: 'Lab1322',
    role: 'nurse',
    subject: 'Division of General Medicine',
    resourceType: '',
    idNum: 'T123456789',
    birth: new Date(1997, 7, 7),
    id: '',
    password: '0807',
    status: true,
    name: [{ text: '' }],
    identifier: [
      { value: '' },
      { value: '' },
      { value: '' }
    ],
    telecom: [{ value: '' }],
    gender: 'female',
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

  let patientId: string;
  let doctorId: string;
  let nurseId: string;
  let patientIds: string[] = [];
  let doctorIds: string[] = [];
  let nurseIds: string[] = [];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsComponent);
    account = fixture.componentInstance;
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

    /* add mock nurse */
    account.account = mockNurse;
    account.updatePassObj.newPass = '';
    account.accountToServer();
    await account.apiService.addData('Practitioner', account.account).toPromise().then(
      data => {
        nurseId = data.id;
        nurseIds.push(nurseId);
      }
    );
  });

  afterAll(async () => {
    deletePatient();
    deleteDoctor();
    deleteNurse();
  });

  describe('Delete account', () => {
    it('should open the confirm-dialog', async () => {
      account.deleteAccount();
      fixture.detectChanges();
      const confirmDialog = fixture.debugElement.query(By.css('.ui-dialog-title')).nativeElement;
      expect(confirmDialog).toBeTruthy();
      expect(confirmDialog.textContent).toContain('Delete Confirmation');
    });

    it('should close the confirm-dialog when reject delete', async () => {
      account.deleteAccount();
      fixture.detectChanges();
      const rejectBtn = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[1].nativeElement;
      rejectBtn.click();
      fixture.detectChanges();
      const confirmDialog = fixture.debugElement.query(By.css('.ui-dialog-title'));
      expect(confirmDialog).toEqual(null);
    });

    it('should close the confirm-dialog when accpet delete', async () => {
      account.account = mockPatient;
      account.account.id = patientIds.pop();
      account.deleteAccount();
      fixture.detectChanges();
      const acceptBtn = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[0].nativeElement;
      acceptBtn.click();
      fixture.detectChanges();
      const confirmDialog = fixture.debugElement.query(By.css('.ui-dialog-title'));
      expect(confirmDialog).toEqual(null);
    });
  });

  describe('Get accounts', () => {
    it('should get own and patient\'s accounts from server when user is doctor', async () => {
      const store = { id: doctorId };
      const mockLocalStorage = {
        getItem: (key: string): string => {
          return key in store ? store[key] : null;
        }
      };
      spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
      spyOn(account.apiService, 'getData').and.callThrough();
      account.loginRole = 'doctor';
      account.accounts = [];
      account.getAccounts();
      fixture.detectChanges();
      expect(account.apiService.getData).toHaveBeenCalled();
    });

    it('should get own and patient\'s accounts  from server when user is nurse', async () => {
      const store = { id: nurseId };
      const mockLocalStorage = {
        getItem: (key: string): string => {
          return key in store ? store[key] : null;
        }
      };
      spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
      spyOn(account.apiService, 'getData').and.callThrough();
      account.loginRole = 'nurse';
      account.getAccounts();
      expect(account.apiService.getData).toHaveBeenCalled();
    });

    it('should get own account from server when user is patient', async () => {
      const store = { id: patientId };
      const mockLocalStorage = {
        getItem: (key: string): string => {
          return key in store ? store[key] : null;
        }
      };
      spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
      spyOn(account.apiService, 'getData').and.callThrough();
      account.loginRole = 'patient';
      account.accounts = [];
      account.getAccounts();
      fixture.detectChanges();
      expect(account.apiService.getData).toHaveBeenCalled();
    });

    it('should get all accounts from server when user is admin', async () => {
      const store = { id: '123' };
      const mockLocalStorage = {
        getItem: (key: string): string => {
          return key in store ? store[key] : null;
        }
      };
      spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
      spyOn(account.apiService, 'getData').and.callThrough();
      account.loginRole = 'admin';
      account.accounts = [];
      account.getAccounts();
      fixture.detectChanges();
      expect(account.apiService.getData).toHaveBeenCalled();
    });
  });

  describe('Update password', () => {
    it('should update password successfully', async () => {
      account.account = mockPatient;
      account.account.id = patientId;
      account.updatePassObj.oldPass = '1010';
      account.updatePassObj.newPass = 'hello';
      account.updatePassObj.confirmPass = 'hello';
      spyOn(account.apiService, 'updateData').and.callThrough();
      account.saveUpdatePass();
      fixture.detectChanges();
      expect(account.apiService.updateData).toHaveBeenCalled();
    });

    it('should not update password with incorrect confirm password', async () => {
      account.account = mockPatient;
      account.account.id = patientId;
      account.updatePassObj.oldPass = '1010';
      account.updatePassObj.newPass = 'hello';
      account.updatePassObj.confirmPass = 'hi';
      spyOn(account.apiService, 'updateData').and.callThrough();
      account.saveUpdatePass();
      fixture.detectChanges();
      const dialog = fixture.debugElement.query(By.css('#update_password'));
      expect(dialog.nativeElement.textContent).not.toEqual(null);
      expect(account.apiService.updateData).not.toHaveBeenCalled();

      const toastMessage = fixture.debugElement.query(By.css('.ui-toast-message'));
      expect(toastMessage.nativeElement).toBeTruthy();
      expect(toastMessage.nativeElement.classList).toContain('ui-toast-message-error');
    });

    it('should not update password with incorrect old password', async () => {
      account.account = mockPatient;
      account.account.id = patientId;
      account.updatePassObj.oldPass = '0101';
      account.updatePassObj.newPass = 'hello';
      account.updatePassObj.confirmPass = 'hello';
      spyOn(account.apiService, 'updateData').and.callThrough();
      account.saveUpdatePass();
      fixture.detectChanges();
      const dialog = fixture.debugElement.query(By.css('#update_password'));
      expect(dialog.nativeElement).not.toEqual(null);
      expect(account.apiService.updateData).not.toHaveBeenCalled();

      const toastMessage = fixture.debugElement.query(By.css('.ui-toast-message'));
      expect(toastMessage.nativeElement).toBeTruthy();
      expect(toastMessage.nativeElement.classList).toContain('ui-toast-message-error');
    });
  });

  it('should initialize data with patient', async () => {
    const store = { name: 'Patient', idNum: 'C123456789', role: 'patient', id: patientId };
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      }
    };
    const patientList = [
      { label: 'Patient', value: 'patient' }
    ];

    spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(account, 'initData').and.callThrough();
    spyOn(account, 'getAccounts').and.callThrough();
    spyOn(account, 'viewDecide').and.callThrough();

    account.ngOnInit();
    expect(account.viewDecide).toHaveBeenCalled();
    expect(account.initData).toHaveBeenCalled();
    expect(account.getAccounts).toHaveBeenCalled();
    expect(account.roleList).toEqual(patientList);
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

  function deleteNurse() {
    nurseIds.forEach((id, i) => {
      account.apiService.deleteData('Practitioner', id).subscribe();
    });
  }

});
