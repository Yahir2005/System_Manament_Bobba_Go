import { TestBed } from '@angular/core/testing';
import { ServiceProducts } from './service-products';

describe('ServiceProducts', () => {
  let service: ServiceProducts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProducts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
