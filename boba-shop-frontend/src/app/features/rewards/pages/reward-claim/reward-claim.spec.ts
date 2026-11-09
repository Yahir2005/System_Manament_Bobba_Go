import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RewardClaim } from './reward-claim';

describe('RewardClaim', () => {
  let component: RewardClaim;
  let fixture: ComponentFixture<RewardClaim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardClaim],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(RewardClaim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
