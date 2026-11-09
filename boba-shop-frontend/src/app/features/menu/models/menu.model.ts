export interface ProductTypeSummary {
  id_type: number;
  name: 'Beverage' | 'Food' | string;
}

export interface CategorySummary {
  id_category: number;
  id_type: number;
  name: string;
}

export interface MenuItem {
  id_product: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_name: string;
  type_name: string;
}

export interface MenuSection {
  type: ProductTypeSummary;
  categories: {
    category: CategorySummary;
    products: MenuItem[];
  }[];
}