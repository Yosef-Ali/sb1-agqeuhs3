'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/product';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const productsCache: {
  data: Product[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      if (isLoading) return; // Prevent multiple simultaneous requests
      
      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        const now = Date.now();
        if (productsCache.data && (now - productsCache.timestamp) < CACHE_TTL) {
          setProducts(productsCache.data);
          setIsLoading(false);
          return;
        }
        
        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        if (!isCancelled) {
          // Update cache
          productsCache.data = data || [];
          productsCache.timestamp = now;
          
          setProducts(data || []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching products:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { products, isLoading, error };
}
