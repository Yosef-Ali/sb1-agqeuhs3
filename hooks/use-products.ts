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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = async () => {
    const fetchProducts = async () => {
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

        // Update cache
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

    await fetchProducts();
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

  return { products, isLoading, error, refreshProducts };
}
