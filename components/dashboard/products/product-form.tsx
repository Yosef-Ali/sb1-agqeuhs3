"use client"

import { useState } from "react"
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
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: number;
    stock: number;
    imageUrl?: string;
  }>({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    let productData = { ...formData };
    
    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const { url } = await response.json()
      productData = {
        ...productData,
        imageUrl: url
      }
      console.log('Product data with image:', productData)
    }
    
    console.log('Product data:', productData)
    
    // Save product data here
    // ...

    onClose()
  } catch (error) {
    console.error('Error saving product:', error)
  }
}

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      // ...existing form submission code...
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Something went wrong')
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
