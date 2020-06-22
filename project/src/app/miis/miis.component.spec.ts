import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MIISComponent } from './miis.component';
import { AppModule } from '../app.module';

describe('MIISComponent', () => {
  let miis: MIISComponent;
  let fixture: ComponentFixture<MIISComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MIISComponent);
    miis = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    const store = {name: 'Tina'};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      }
    };
    spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
  });

  it('should be created', () => {
    expect(miis).toBeTruthy();
  });

  it('should redirect to Home page when login successfully', () => {
    miis.loginSuccess();
    expect(miis.apperPage).toEqual('Index');
    expect(miis.loginUser).toEqual('Tina');
  });

  it('should log out and redirect to Login page', () => {
    miis.logOut();
    expect(miis.apperPage).toEqual('login');
  });
});
