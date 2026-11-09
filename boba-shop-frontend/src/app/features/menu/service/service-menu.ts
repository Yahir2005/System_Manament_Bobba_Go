import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuSection } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getPublicMenu(): Observable<MenuSection[]> {
    return this.http.get<MenuSection[]>(`${this.apiUrl}/menu`);
  }
}

export { MenuService as ServiceMenu };
