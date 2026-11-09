import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductApprovalList } from './product-approval-list';

describe('ProductApprovalList', () => {
  let component: ProductApprovalList;
  let fixture: ComponentFixture<ProductApprovalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductApprovalList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductApprovalList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
