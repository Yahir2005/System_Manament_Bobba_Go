import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../service/service-menu';
import { MenuSection } from '../../models/menu.model';

@Component({
  selector: 'app-menu-catalog',
  imports: [CommonModule],
  templateUrl: './menu-catalog.html',
  styleUrl: './menu-catalog.scss'
})
export class MenuCatalog implements OnInit {
  private menuService = inject(MenuService);

  menuSections: MenuSection[] = [];
  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.isLoading = true;
    this.hasError = false;

    this.menuService.getPublicMenu().subscribe({
      next: (data) => {
        this.menuSections = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching menu catalog:', err);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }
}

export { MenuCatalog as MenuCatalogComponent };
