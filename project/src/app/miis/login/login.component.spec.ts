import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AppModule } from '../../app.module';
import { By } from '@angular/platform-browser';
import { click } from '../../../testing/testing/testing.module';
import { Account } from '../../../assets/models/account';
import { Observable } from 'rxjs';
import { ApiModule } from 'src/app/api/api.module';
import { HttpBackend } from '@angular/common/http';

describe('LoginComponent', () => {
  let login: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    login = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Login successfully', () => {
    it('should login as admin', async () => {
      login.accountInfo.user = 'admin';
      login.accountInfo.pass = 'admin';
      login.login();
      expect(login.passwordCurrent).toEqual(true);
    });

    it('should login as general user', async () => {
      const acc = new Account();
      acc.active = true;
      acc.idNum = 'K123456789';
      acc.password = '0807';
      login.accounts.push(acc);

      login.accountInfo.user = 'K123456789';
      login.accountInfo.pass = '0807';
      login.login();
      expect(login.passwordCurrent).toEqual(true);
    });
  });

  describe('Login unsuccessfully', () => {
    describe('With incorrect password', () => {
      it('should not login as amdin', async () => {
        login.accountInfo.user = 'admin';
        login.accountInfo.pass = '';
        login.login();
        expect(login.passwordCurrent).toEqual(false);
        expect(login.accountInfo.user).toEqual('');
        expect(login.accountInfo.pass).toEqual('');
      });

      it('should not login as general user', async () => {
        const acc = new Account();
        acc.active = true;
        acc.idNum = 'K123456789';
        acc.password = '0807';
        login.accounts.push(acc);

        login.accountInfo.user = 'K123456789';
        login.accountInfo.pass = '';
        login.login();
        expect(login.passwordCurrent).toEqual(false);
        expect(login.accountInfo.user).toEqual('');
        expect(login.accountInfo.pass).toEqual('');
      });
    });

    it('should not login with unexist account', async () => {
      login.accountInfo.user = 'K123456789';
      login.accountInfo.pass = '0000';
      login.login();
      expect(login.passwordCurrent).toEqual(false);
      expect(login.accountInfo.user).toEqual('');
      expect(login.accountInfo.pass).toEqual('');
    });
  });

  describe('Send mail', () => {
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

    it('should success by correct info', async () => {
      login.accounts = [mockPatient];
      login.emailForgot = 'patient@gmail.com';
      login.accountForgot = 'K123456789';
      const mockSendMail = {
        sendMail: (data: any): any => {
          return login.apiService.http.get('http://140.124.181.142:8888/hapi-fhir-jpaserver/fhir/Appointment?_format=json&_pretty=true&reason-code=TESTEESTSTSYS');
        }
      };
      spyOn(login.apiService, 'sendMail').and.callFake(mockSendMail.sendMail);
      spyOn(login, 'exitForgot').and.callThrough();

      const isCorrect = login.checkForgot();
      fixture.detectChanges();
      expect(isCorrect).toEqual(true);
      expect(login.apiService.sendMail).toHaveBeenCalled();
      expect(login.exitForgot).toHaveBeenCalled();
    });

    it('should fail by incorrect email', async () => {
      login.accounts = [mockPatient];
      login.emailForgot = 'error@gmail.com';
      login.accountForgot = 'K123456789';
      spyOn(login.apiService, 'sendMail').and.callThrough();
      spyOn(login, 'exitForgot').and.callThrough();

      const isCorrect = login.checkForgot();
      fixture.detectChanges();
      expect(isCorrect).toEqual(false);
      expect(login.apiService.sendMail).not.toHaveBeenCalled();
      expect(login.exitForgot).not.toHaveBeenCalled();
    });

    it('should fail by incorrect accountId', async () => {
      login.accounts = [mockPatient];
      login.emailForgot = 'patient@gmail.com';
      login.accountForgot = 'error';
      spyOn(login.apiService, 'sendMail').and.callThrough();
      spyOn(login, 'exitForgot').and.callThrough();

      const isCorrect = login.checkForgot();
      fixture.detectChanges();
      expect(isCorrect).toEqual(false);
      expect(login.apiService.sendMail).not.toHaveBeenCalled();
      expect(login.exitForgot).not.toHaveBeenCalled();
    });
  });

  it('should be created', async () => {
    expect(login).toBeTruthy();
  });

  it('should initialize datas', async () => {
    spyOn(login, 'getAccount').and.callThrough();
    login.ngOnInit();
    expect(login.getAccount).toHaveBeenCalled();
  });

  it('should convert string to Date', async () => {
    const date = login.stringToDate('2019-12-05');
    expect(date.getFullYear()).toEqual(2019);
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(5);
  });

  it('should trigger login function when press enter key ', async () => {
    spyOn(login, 'login').and.callThrough();
    const inputUser = fixture.debugElement.query(By.css('#float-inputUser'));
    click(inputUser);
    fixture.detectChanges();
    login.pressKey(new KeyboardEvent('keypress', { key: 'Enter' }));
    fixture.detectChanges();
    expect(login.login).toHaveBeenCalled();
  });

  it('should convert server data to show', async () => {
    const mockServerAccount = [{
      resource: {
        name: [{ text: 'Tina' }],
        identifier: [
          { value: 'K123456789' },
          { value: '0807' },
          { value: 'doctor' }
        ],
        telecom: [{ value: 'tina@gmail.com' }],
        gender: 'female',
        birthDate: '1997-08-07',
        active: true,
        address: [{ text: 'Lab1321' }],
        qualification: [{ identifier: [{ value: 'Division of General Medicine' }] }]
      },
    }];
    login.accounts = [];
    login.serverToview(mockServerAccount);
    expect(login.accounts[0].userName).toEqual('Tina');
    expect(login.accounts[0].idNum).toEqual('K123456789');
    expect(login.accounts[0].password).toEqual('0807');
    expect(login.accounts[0].role).toEqual('doctor');
    expect(login.accounts[0].email).toEqual('tina@gmail.com');
    expect(login.accounts[0].gender).toEqual('female');
    expect(login.accounts[0].birth).toEqual(login.stringToDate('1997-08-07'));
    expect(login.accounts[0].status).toEqual(true);
    expect(login.accounts[0].userAddress).toEqual('Lab1321');
    expect(login.accounts[0].subject).toEqual('Division of General Medicine');
  });

  it('should get accounts from server', async () => {
    spyOn(login, 'getAccount').and.callThrough();
    login.getAccount();
    expect(login.getAccount).toHaveBeenCalledWith();
  });

  it('should open forget-password dialog', async () => {
    login.showForgotPass();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#forgot_password'));
    expect(dialog.nativeElement).toBeTruthy();
  });

  it('should close forget-password dialog', async () => {
    login.exitForgot();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('#forgot_password'));
    expect(dialog).toEqual(null);
  });
});
