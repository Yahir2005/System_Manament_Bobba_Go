import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceCategories } from './service-categories';

describe('ServiceCategories', () => {
  let service: ServiceCategories;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ServiceCategories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
