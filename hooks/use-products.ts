'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchProducts() {
      try {
        setError(null);
        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .throwOnError();

        if (supabaseError) {
          throw supabaseError;
        }

        if (isMounted) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}
