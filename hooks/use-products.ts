'use client';

import { supabase } from '@/lib/supabase/client';
import { Product, Category } from '@/types/product'; // Ensure correct import
import { useEffect, useState } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const productsCache = {
  data: null as Product[] | null,
  timestamp: 0,
};

interface ImageUploadResponse {
  url?: string;
  error?: string;
}

export interface ProductWithImage extends Partial<Product> {
  imageFile?: File | null;
  status?: string;
  category_id?: string | null; // Rename to category_id and allow null
  unit?: string | null;        // Add unit field
}

export function useProducts(initialProducts?: Product[]) { // Make initialProducts optional
  const [products, setProducts] = useState(initialProducts)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      setProducts(data)
    }

    if (!initialProducts) {
      fetchProducts()
    }
  }, [supabase, initialProducts])

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CRUD Operations
  const uploadProductImage = async (file: File): Promise<ImageUploadResponse> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return { error: uploadError.message }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return { url: publicUrl }
    } catch (error) {
      console.error('Image upload error:', error)
      return { error: 'Failed to upload image' }
    }
  }

  const createProduct = async (data: ProductWithImage): Promise<Product> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Basic validation
      if (!data.name || !data.price) {
        throw new Error('Name and price are required');
      }

      let productData = { ...data };
      const imageFile = productData.imageFile;
      delete productData.imageFile;

      // Image upload handling
      if (imageFile) {
        const { url, error: uploadError } = await uploadProductImage(imageFile);
        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError}`);
        }
        productData.image_url = url;
      }

      // Create product
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
          status: productData.status || 'in-stock',
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`);
      }

      if (!newProduct) {
        throw new Error('Failed to create product: No data returned');
      }

      await refreshProducts();
      return newProduct;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, data: ProductWithImage): Promise<Product> => {
    setIsLoading(true);
    try {
      let productData = { ...data };
      const imageFile = productData.imageFile || null;
      delete productData.imageFile;

      if (imageFile) {  // Changed condition to check for non-null
        const { url, error: uploadError } = await uploadProductImage(imageFile);
        if (uploadError) throw new Error(uploadError);
        productData.image_url = url;
      }

      const { data: updatedProduct, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await refreshProducts();
      return updatedProduct;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await refreshProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Update cache
      productsCache.data = data || [];
      productsCache.timestamp = Date.now();

      setProducts(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      throw new Error(message);
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
          setProducts(productsCache.data);
          return;
        }

        await refreshProducts();
      } catch (err) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : 'Failed to fetch products';
          setError(message);
        }
      }
    };

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    products,
    isLoading,
    error,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
