import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../service/service-menu';
import { MenuItem, MenuSection } from '../../models/menu.model';
import { AuthService } from '../../../auth/service/service-auth';

export interface CategoryMeta {
  image: string;
  label: string;
  icon: string;
  description: string;
}

export interface FlattenedCategory {
  id_category: number;
  name: string;
  type_name: string;
  products: MenuItem[];
}

/**
 * Angular 22 funciona en modo "zoneless": las respuestas HTTP NO disparan la
 * detección de cambios. Por eso el estado asíncrono se guarda en signals, que
 * notifican a Angular automáticamente cuando cambian.
 */
@Component({
  selector: 'app-menu-catalog',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-catalog.html',
  styleUrl: './menu-catalog.scss'
})
export class MenuCatalog implements OnInit {
  private menuService = inject(MenuService);
  authService = inject(AuthService);

  menuSections = signal<MenuSection[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  // Conjunto de IDs de categorías desplegadas/abiertas actualmente
  openCategories = signal<Set<number>>(new Set());

  // Permite editar publicaciones si el usuario es administrador o empleado
  canEdit(): boolean {
    return this.authService.isAdmin() || this.authService.isEmployee();
  }

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.menuService.getPublicMenu().subscribe({
      next: (data) => {
        this.menuSections.set(data);
        this.isLoading.set(false);

        // Por defecto, desplegar todas las categorías disponibles
        const allIds = new Set<number>();
        data.forEach((section) => {
          section.categories.forEach((catGroup) => {
            allIds.add(catGroup.category.id_category);
          });
        });
        this.openCategories.set(allIds);
      },
      error: (err) => {
        console.error('Error fetching menu catalog:', err);
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  // Verifica si una categoría específica está desplegada
  isCategoryOpen(categoryId: number): boolean {
    return this.openCategories().has(categoryId);
  }

  // Alterna el estado desplegado/plegado de una categoría
  toggleCategory(categoryId: number): void {
    this.openCategories.update((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  // Despliega una categoría y hace scroll suave hacia ella
  selectAndScrollToCategory(categoryId: number): void {
    // Asegurar que la categoría quede desplegada
    this.openCategories.update((current) => {
      const next = new Set(current);
      next.add(categoryId);
      return next;
    });

    // Desplazamiento suave al elemento en pantalla
    setTimeout(() => {
      const elem = document.getElementById(`category-${categoryId}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  // Desplegar todas las categorías
  expandAll(): void {
    const allIds = new Set<number>();
    this.menuSections().forEach((section) => {
      section.categories.forEach((catGroup) => {
        allIds.add(catGroup.category.id_category);
      });
    });
    this.openCategories.set(allIds);
  }

  // Plegar todas las categorías
  collapseAll(): void {
    this.openCategories.set(new Set());
  }

  // Obtiene lista plana de categorías para los botones superiores
  getFlattenedCategories(): FlattenedCategory[] {
    const list: FlattenedCategory[] = [];
    for (const section of this.menuSections()) {
      for (const catGroup of section.categories) {
        list.push({
          id_category: catGroup.category.id_category,
          name: catGroup.category.name,
          type_name: section.type.name,
          products: catGroup.products
        });
      }
    }
    return list;
  }

  // Retorna total de productos activos en el menú
  getTotalProductsCount(): number {
    let count = 0;
    for (const section of this.menuSections()) {
      for (const catGroup of section.categories) {
        count += catGroup.products.length;
      }
    }
    return count;
  }

  // Metadatos visuales representativos para cada categoría (imagen, icono y etiqueta corta)
  getCategoryMeta(categoryName: string, fallbackImg?: string | null): CategoryMeta {
    const lower = categoryName.toLowerCase();

    if (lower.includes('boba') || lower.includes('tapioca')) {
      return {
        image: 'https://images.unsplash.com/photo-1558857563-b37cf5a917a2?w=300',
        label: 'Boba Tea',
        icon: 'bi-cup-straw',
        description: 'Tés con perlas artesanales de tapioca'
      };
    }

    if (lower.includes('café') || lower.includes('cafe')) {
      return {
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300',
        label: 'Cafés',
        icon: 'bi-cup-hot',
        description: 'Espressos, lattes de vainilla y calientes'
      };
    }

    if (lower.includes('soda')) {
      return {
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300',
        label: 'Sodas Italianas',
        icon: 'bi-droplet-half',
        description: 'Bebidas refrescantes gasificadas con fruta'
      };
    }

    if (lower.includes('infusi') || lower.includes('té') || lower.includes('te')) {
      return {
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300',
        label: 'Infusiones',
        icon: 'bi-flower1',
        description: 'Infusiones naturales aromáticas y frutales'
      };
    }

    if (lower.includes('pastel') || lower.includes('reposter')) {
      return {
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300',
        label: 'Repostería',
        icon: 'bi-cake2',
        description: 'Pasteles ligeros, cheesecakes y postres'
      };
    }

    if (lower.includes('snack')) {
      return {
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300',
        label: 'Snacks',
        icon: 'bi-basket2',
        description: 'Bocadillos y complementos deliciosos'
      };
    }

    // Fallback dinámico para categorías personalizadas creadas por el admin
    return {
      image: fallbackImg || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
      label: categoryName,
      icon: 'bi-tag',
      description: 'Especialidades de Bobba Go'
    };
  }
}

export { MenuCatalog as MenuCatalogComponent };
