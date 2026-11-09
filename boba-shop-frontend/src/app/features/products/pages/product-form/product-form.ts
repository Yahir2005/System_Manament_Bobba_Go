import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/service-products';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm!: FormGroup;
  // Signals: necesarios en modo zoneless (las respuestas HTTP/FileReader no disparan detección de cambios)
  categories = signal<Category[]>([]);
  errorMessage = signal('');
  isSubmitting = signal(false);
  isLoadingProduct = signal(false);

  // Modo edición
  isEditMode = signal(false);
  productId = signal<number | null>(null);

  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);
  isDragging = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.checkEditMode();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id_category: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(120)]],
      description: [''],
      precio: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  private checkEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id) && id > 0) {
        this.isEditMode.set(true);
        this.productId.set(id);
        this.loadProduct(id);
      }
    }
  }

  private loadProduct(id: number): void {
    this.isLoadingProduct.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.isLoadingProduct.set(false);
        this.productForm.patchValue({
          id_category: product.id_category,
          name: product.name,
          description: product.description || '',
          precio: product.price
        });
        if (product.image_url) {
          this.previewUrl.set(product.image_url);
        }
      },
      error: (err) => {
        this.isLoadingProduct.set(false);
        console.error('Error al cargar producto para edición:', err);
        this.errorMessage.set('No se pudo encontrar el producto a editar.');
      }
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  // Eventos Drag & Drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      alert('Solo se admiten archivos de imagen (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5 MB.');
      return;
    }

    this.selectedFile = file;

    // Generar vista previa inmediata en el navegador
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.previewUrl.set(null);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Se empaca en FormData para admitir archivos binarios + texto para multer
    const formData = new FormData();
    formData.append('id_category', String(this.productForm.get('id_category')?.value));
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value || '');
    formData.append('price', String(this.productForm.get('precio')?.value));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.previewUrl()) {
      formData.append('image_url', this.previewUrl()!);
    }

    if (this.isEditMode() && this.productId()) {
      // Al editar, el backend actualiza los datos y cambia el estado a 'pending',
      // por lo que no se mostrará en el menú del cliente hasta que un administrador lo autorice.
      this.productService.updateProductWithFormData(this.productId()!, formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || err.error?.error || 'Error al actualizar el producto.');
        }
      });
    } else {
      this.productService.createProductWithFormData(formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || err.error?.error || 'Error al guardar el producto.');
        }
      });
    }
  }
}

export { ProductForm as ProductFormComponent };
