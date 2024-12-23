import { Suspense } from 'react';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Fresh Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProductFilters />
        </aside>
        <main className="flex-1">
          <ErrorBoundary fallback={<div>Error loading products. Please try again later.</div>}>
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
