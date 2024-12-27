export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  image_url: string;
  organic: boolean;
  created_at: string;
  status?: string; // Add status property
}