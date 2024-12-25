'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useProducts } from '@/hooks/use-products';

const ProductsContext = createContext<ReturnType<typeof useProducts> | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const productsData = useProducts();

  const handleError = useCallback((error: Error) => {
    console.error('Products Provider Error:', error);
    // Add any error handling logic here
  }, []);

  return (
    <ProductsContext.Provider value={productsData}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
}
