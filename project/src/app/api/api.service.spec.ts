import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { AppModule } from '../app.module';
import { HttpClient } from '@angular/common/http/public_api';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpClient;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
  }));

  beforeEach(() => {
    service = new ApiService(http);
  });

  it('should be created', async () => {
    service = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
