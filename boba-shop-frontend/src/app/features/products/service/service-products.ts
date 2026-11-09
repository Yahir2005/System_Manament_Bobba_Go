import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Category,
  CreateProductDto,
  Product,
  ReviewProductDto
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Obtener categorías para el dropdown (Bobbas, Pasteles, Sodas Italianas, etc.)
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Listar productos aprobados para el catálogo público
  getApprovedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/approved`);
  }

  // Listar todos los productos (vista interna para empleados y admin)
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // Listar productos pendientes de aprobación (vista admin)
  getPendingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/pending`);
  }

  // Registrar nuevo producto (por defecto el backend lo guarda en 'pending')
  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  // Cambiar estatus de un producto (solo administrador: 'approved' | 'rejected')
  reviewProduct(id_product: number, review: ReviewProductDto): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id_product}/status`, review);
  }
}