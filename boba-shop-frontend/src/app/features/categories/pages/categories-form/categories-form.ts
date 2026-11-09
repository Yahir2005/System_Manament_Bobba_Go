import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../service/service-categories';
import { Category, ProductType } from '../../../products/models/product.model';

@Component({
  selector: 'app-categories-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './categories-form.html',
  styleUrl: './categories-form.scss'
})
export class CategoriesForm implements OnInit {
  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);

  categoryForm!: FormGroup;

  // Signals para compatibilidad con Angular 22 zoneless
  categories = signal<Category[]>([]);
  productTypes = signal<ProductType[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      id_type: ['', [Validators.required]]
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    this.categoriesService.getProductTypes().subscribe({
      next: (types) => {
        this.productTypes.set(types);
        this.loadCategoriesList();
      },
      error: (err) => {
        console.error('Error al cargar tipos de producto:', err);
        this.loadCategoriesList();
      }
    });
  }

  private loadCategoriesList(): void {
    this.categoriesService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      name: this.categoryForm.get('name')?.value.trim(),
      id_type: Number(this.categoryForm.get('id_type')?.value)
    };

    this.categoriesService.createCategory(payload).subscribe({
      next: (newCat) => {
        this.isSubmitting.set(false);
        this.successMessage.set(`Categoría "${newCat.name}" agregada exitosamente.`);
        this.categoryForm.reset({ name: '', id_type: '' });
        // Actualizamos la lista de categorías inmediatamente con Signals
        this.categories.update((list) => [...list, newCat]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || err.error?.error || 'Error al registrar la categoría.');
      }
    });
  }
}

export { CategoriesForm as CategoriesFormComponent };
