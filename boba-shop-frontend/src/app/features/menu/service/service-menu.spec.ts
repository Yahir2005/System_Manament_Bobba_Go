import { TestBed } from '@angular/core/testing';
import { ServiceMenu } from './service-menu';

describe('ServiceMenu', () => {
  let service: ServiceMenu;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceMenu);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
