'use client';

import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📡 Calling Supabase products.select()');
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('❌ Supabase error:', supabaseError);
        throw supabaseError;
      }

      console.log('✅ API Success:', {
        productsCount: data?.length || 0,
        firstProduct: data?.[0],
        timestamp: new Date().toISOString()
      });

      // Clear cache and update with fresh data
      productsCache.data = data || [];
      productsCache.timestamp = Date.now();

      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      try {
        // Check cache first
        const now = Date.now();
        if (productsCache.data && (now - productsCache.timestamp) < CACHE_TTL) {
          console.log('📦 Cache hit:', {
            cacheAge: Math.round((now - productsCache.timestamp) / 1000) + 's',
            products: productsCache.data.length,
            timestamp: new Date().toISOString()
          });
          setProducts(productsCache.data);
          setIsLoading(false);
          return;
        }
        console.log('🔍 Cache miss or expired, fetching fresh data');

        setIsLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw new Error(`Failed to fetch products: ${supabaseError.message}`);
        }

        if (!data) {
          console.warn('No data received from Supabase');
          throw new Error('No data received from the server');
        }

        if (!Array.isArray(data)) {
          console.error('Invalid data format received:', data);
          throw new Error('Invalid data format received from the server');
        }

        if (!isCancelled) {
          // Update cache
          productsCache.data = data;
          productsCache.timestamp = now;

          setProducts(data);
          console.log('Successfully loaded', data.length, 'products');
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
          console.error('Error in fetchProducts:', errorMessage, err);
          setError(errorMessage);
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

  return { products, isLoading, error, refreshProducts };
}
