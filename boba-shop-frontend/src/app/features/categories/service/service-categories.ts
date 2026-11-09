import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, ProductType } from '../../products/models/product.model';

export interface CreateCategoryDto {
  name: string;
  id_type: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Obtener catálogo completo de categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Obtener tipos de productos disponibles (Bebida / Alimento)
  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.apiUrl}/product-types`);
  }

  // Crear nueva categoría (restringido a administradores por backend)
  createCategory(category: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }
}

export { CategoriesService as ServiceCategories };
