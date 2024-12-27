export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string | null; // Updated to allow null
  unit?: string | null;     // Add unit field
  stock_quantity: number;
  image_url: string;
  organic: boolean;
  created_at: string;
  status?: string; // Add status property
}