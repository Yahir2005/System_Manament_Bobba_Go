import { TestBed } from '@angular/core/testing';
import { ServiceRewards } from './service-rewards';

describe('ServiceRewards', () => {
  let service: ServiceRewards;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceRewards);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
