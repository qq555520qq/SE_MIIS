import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MIISComponent } from './miis/miis.component';
import { LoginComponent } from './miis/login/login.component';
import { CaseComponent } from './miis/case/case.component';
import { AccountsComponent } from './miis/accounts/accounts.component';
import { OnlineComponent } from './miis/online/online.component';
import { OnlineRentalComponent } from './miis/online-rental/online-rental.component';
import { CommonsModule } from './common/commons.module';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonsModule
      ],
      declarations: [
        AppComponent,
        MIISComponent,
        LoginComponent,
        CaseComponent,
        AccountsComponent,
        OnlineComponent,
        OnlineRentalComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  });

  it('should be created the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'MIIS'`, () => {
    expect(app.title).toEqual('MIIS');
  });
});
