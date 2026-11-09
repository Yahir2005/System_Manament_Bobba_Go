export type ProductStatus = 'pending' | 'approved' | 'rejected';

export interface ProductType {
  id_type: number;
  name: string;
}

export interface Category {
  id_category: number;
  id_type: number;
  name: string;
  type?: ProductType;
}

export interface Product {
  id_product: number;
  id_category: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  status: ProductStatus;
  created_by: number;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  category?: Category;
}

export interface CreateProductDto {
  id_category: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

export interface ReviewProductDto {
  status: 'approved' | 'rejected';
}