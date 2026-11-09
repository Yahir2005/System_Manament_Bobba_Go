import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/service-products';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-approval-list',
  imports: [CommonModule],
  templateUrl: './product-approval-list.html',
  styleUrl: './product-approval-list.scss'
})
export class ProductApprovalList implements OnInit {
  private productService = inject(ProductService);

  // Signals: necesarios en modo zoneless para que la vista se actualice tras la respuesta HTTP
  pendingProducts = signal<Product[]>([]);
  isLoading = signal(true);
  feedbackMessage = signal('');
  feedbackType = signal<'success' | 'danger'>('success');

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  loadPendingProducts(): void {
    this.isLoading.set(true);
    this.productService.getPendingProducts().subscribe({
      next: (data) => {
        this.pendingProducts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading pending products:', err);
        this.isLoading.set(false);
      }
    });
  }

  updateStatus(product: Product, newStatus: 'approved' | 'rejected'): void {
    this.productService.reviewProduct(product.id_product, { status: newStatus }).subscribe({
      next: () => {
        this.feedbackType.set(newStatus === 'approved' ? 'success' : 'danger');
        this.feedbackMessage.set(`Producto "${product.name}" ha sido ${newStatus === 'approved' ? 'aprobado' : 'rechazado'}.`);
        this.pendingProducts.update((list) => list.filter((p) => p.id_product !== product.id_product));
      },
      error: (err) => {
        this.feedbackType.set('danger');
        this.feedbackMessage.set(err.error?.message || err.error?.error || 'Error al actualizar el estado del producto.');
      }
    });
  }
}

export { ProductApprovalList as ProductApprovalListComponent };
