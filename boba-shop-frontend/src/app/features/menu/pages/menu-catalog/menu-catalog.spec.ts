import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MenuCatalog } from './menu-catalog';

describe('MenuCatalog', () => {
  let component: MenuCatalog;
  let fixture: ComponentFixture<MenuCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCatalog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
