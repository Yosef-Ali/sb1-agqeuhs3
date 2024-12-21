'use client';

import { useProducts } from '@/hooks/use-products';
import { ProductCard } from './product-card';

export function ProductGrid() {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}