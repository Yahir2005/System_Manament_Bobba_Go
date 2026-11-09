import { TestBed } from '@angular/core/testing';
import { ServiceLoyalty } from './service-loyalty';

describe('ServiceLoyalty', () => {
  let service: ServiceLoyalty;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceLoyalty);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
