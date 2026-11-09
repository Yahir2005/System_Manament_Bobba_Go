import { Component, OnInit, inject } from '@angular/core';
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

  pendingProducts: Product[] = [];
  isLoading = true;
  feedbackMessage = '';
  feedbackType: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  loadPendingProducts(): void {
    this.isLoading = true;
    this.productService.getPendingProducts().subscribe({
      next: (data) => {
        this.pendingProducts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending products:', err);
        this.isLoading = false;
      }
    });
  }

  updateStatus(product: Product, newStatus: 'approved' | 'rejected'): void {
    this.productService.reviewProduct(product.id_product, { status: newStatus }).subscribe({
      next: () => {
        this.feedbackType = newStatus === 'approved' ? 'success' : 'danger';
        this.feedbackMessage = `Producto "${product.name}" ha sido ${newStatus === 'approved' ? 'aprobado' : 'rechazado'}.`;
        this.pendingProducts = this.pendingProducts.filter(p => p.id_product !== product.id_product);
      },
      error: (err) => {
        this.feedbackType = 'danger';
        this.feedbackMessage = err.error?.message || 'Error al actualizar el estado del producto.';
      }
    });
  }
}

export { ProductApprovalList as ProductApprovalListComponent };
