import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuCatalog } from './menu-catalog';

describe('MenuCatalog', () => {
  let component: MenuCatalog;
  let fixture: ComponentFixture<MenuCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
