import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../service/service-products';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  productForm!: FormGroup;
  categories: Category[] = [];
  errorMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id_category: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(120)]],
      description: [''],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      image_url: ['']
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      ...this.productForm.value,
      price: this.productForm.value.precio
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Redirige al listado interno informando que el producto quedó en estado pendiente
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al enviar el producto para aprobación';
      }
    });
  }
}