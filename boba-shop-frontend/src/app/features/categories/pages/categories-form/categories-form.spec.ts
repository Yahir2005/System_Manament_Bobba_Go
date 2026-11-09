import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CategoriesForm } from './categories-form';

describe('CategoriesForm', () => {
  let component: CategoriesForm;
  let fixture: ComponentFixture<CategoriesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
