"use client"

import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface ProductFormProps {
  open: boolean
  onClose: () => void
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  onError?: (error: string) => void
  product?: {
    id: string
    name: string
    category: string
    price: number
    stock: number
    status: "in-stock" | "low-stock" | "out-of-stock"
  }
}

export function ProductForm({
  open,
  onClose,
  isLoading = false,
  setIsLoading = () => {},
  onError = () => {},
  product
}: ProductFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: number;
    stock: number;
    image_url?: string;
    status: "in-stock" | "low-stock" | "out-of-stock";
  }>({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    image_url: product?.imagUrl || "",
    status: product?.status || "in-stock"
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  try {
    let image_url = formData.image_url;
    
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      image_url = publicUrl
    }

    // Calculate status based on stock
    const status = formData.stock === 0 
      ? "out-of-stock" 
      : formData.stock < 10 
        ? "low-stock" 
        : "in-stock";

    const productData = {
      name: formData.name,
      category: formData.category,
      price: formData.price,
      stock: formData.stock,
      status,
      image_url,
      updated_at: new Date().toISOString()
    }

    if (product?.id) {
      // Update existing product
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id)

      if (error) throw error
    } else {
      // Create new product
      const { error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString()
        }])

      if (error) throw error
    }

    // Refresh the products list
    window.location.reload()
  } catch (error) {
    console.error('Error saving product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save product'
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    })
    onError(errorMessage)
  } finally {
    setIsLoading(false)
  }
}


  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{product ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {product
              ? "Make changes to the product here."
              : "Add a new product to your store."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
<ImageUpload
  onChange={setImageFile}
  disabled={false}
/>
{imageFile && (
  <div className="mt-4">
    <Label htmlFor="preview">Preview</Label>
    <img
      id="preview"
      src={URL.createObjectURL(imageFile)}
      alt="Product Preview"
      className="w-full h-auto max-h-64 object-cover rounded-md"
    />
  </div>
)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
