export interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  description: string;
  image_url?: string;
  organic: boolean;
  created_at?: string;
  updated_at?: string;
}
