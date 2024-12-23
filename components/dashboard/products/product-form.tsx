"use client"

import { useState } from "react"
import Image from "next/image"
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

import { Product } from '@/types/product'

export interface ProductFormProps {
  open: boolean
  onClose: () => void
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  onError?: (error: string) => void
  product?: Product | null
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
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || 0,
    stock_quantity: product?.stock_quantity || 0,
    image_url: product?.image_url || "",
    organic: product?.organic || false,
    description: product?.description || ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (submitting) return // Prevent double submission
  setSubmitting(true)
  setIsLoading(true)
  
  try {
    // Validate required fields
    if (!formData.name || !formData.category || formData.price === undefined || formData.stock_quantity === undefined) {
      throw new Error('Please fill in all required fields')
    }

    let finalImageUrl = formData.image_url;
    
    if (imageFile) {
      try {
        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          throw new Error('Image file size must be less than 5MB')
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp']
        const fileExt = imageFile.name.split('.').pop()?.toLowerCase()
        
        if (!validTypes.includes(imageFile.type) || !fileExt || !validExtensions.includes(fileExt)) {
          throw new Error('Please upload a valid image file (JPG, JPEG, PNG, or WebP)')
        }

        // Normalize extension to ensure consistency
        let normalizedExt = fileExt
        if (normalizedExt === 'jpg') normalizedExt = 'jpeg'
        const fileName = `${uuidv4()}.${normalizedExt}`
        const filePath = `products/${fileName}` // Store in products subfolder

        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
          // Check for specific storage permission errors
          // Check for common storage errors
          if (uploadError.message.includes('storage/object-not-found')) {
            throw new Error('Storage bucket not found. Please contact support.')
          }
          if (uploadError.message.includes('storage/unauthorized') || 
             uploadError.message.includes('permission')) {
            throw new Error('Permission denied. Please try logging out and back in.')
          }
          if (uploadError.message.includes('Payload too large')) {
            throw new Error('Image is too large. Please choose a smaller image (max 5MB).')
          }
          // For other storage errors
          throw new Error('Unable to upload this image. Please try a different image or format (JPEG/PNG).')
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        if (!publicUrl) {
          throw new Error('Failed to get public URL for uploaded image')
        }

        finalImageUrl = publicUrl
      } catch (error) {
        console.error('Image upload error:', error)
        // Enhanced error handling with more specific messages
        let errorMessage = 'Failed to upload image'
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          })
          
          // Customize message based on error type
          if (error.message.includes('too large')) {
            errorMessage = 'Image is too large. Please choose a smaller image (max 5MB).'
          } else if (error.message.includes('format') || error.message.includes('type')) {
            errorMessage = 'Invalid image format. Please use JPEG or PNG.'
          } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
            errorMessage = 'Permission error. Please try logging out and back in.'
          } else {
            errorMessage = error.message
          }
        }
        
        toast({
          title: "Image Upload Failed",
          description: errorMessage,
          variant: "destructive",
        })
        
        // Don't throw the error, just return to prevent form submission
        return
      }
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      organic: Boolean(formData.organic),
      description: formData.description || '',
      image_url: finalImageUrl || '',
      updated_at: new Date().toISOString()
    }

    if (product?.id) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString()
        }])

      if (error) throw error
    }

    toast({
      title: "Success",
      description: product?.id ? "Product updated successfully" : "Product created successfully",
    })
    onClose()
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
    setSubmitting(false)
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
    <Image
      id="preview"
      src={URL.createObjectURL(imageFile)}
      alt="Product Preview"
      width={256}
      height={256}
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
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
