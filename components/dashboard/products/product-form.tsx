"use client"

import { useState, useEffect, FormEvent } from "react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import Image from "next/image"
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
import { Product } from "@/types/product" // Import Product type
import { Button } from "@/components/ui/button"
import { useProducts, ProductWithImage } from '@/hooks/use-products'  // Add ProductWithImage to import

interface ProductFormProps {
  open: boolean
  onClose: () => void
  product?: Product | null
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  onError?: (error: string) => void
}

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock_quantity?: string;
  description?: string;
}

export function ProductForm({
  open,
  onClose,
  product,
}: ProductFormProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined) // Initialize as undefined
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const { createProduct, updateProduct, isLoading } = useProducts()

  useEffect(() => {
    if (product) {
      setName(product.name || "")
      setDescription(product.description || "")
      setPrice(product.price?.toString() || "")
      setCategory(product.category || "")
      setStockQuantity(product.stock_quantity?.toString() || "")
      setImageUrl(product.image_url || undefined) // Set as undefined
    } else {
      resetForm()
    }
  }, [product, open])

  const resetForm = async () => {
    setName("")
    setDescription("")
    setPrice("")
    setCategory("")
    setStockQuantity("")
    setImageFile(null)
    setImageUrl(undefined) // Set as undefined

    // Wait for state updates to complete
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!category.trim()) {
      newErrors.category = "Category is required"
    }
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = "Valid price is required"
    }
    if (!stockQuantity || parseInt(stockQuantity) < 0) {
      newErrors.stock_quantity = "Valid stock quantity is required"
    }
    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) return

    try {
      const productData: ProductWithImage = {
        name,
        description,
        price: parseFloat(price),
        category,
        stock_quantity: parseInt(stockQuantity),
        image_url: imageUrl,
        imageFile: imageFile
      }

      if (product?.id) {
        await updateProduct(product.id, productData)
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        await createProduct(productData)
        toast({
          title: "Success",
          description: "Product created successfully",
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg p-6 space-y-6"> {/* Standard ShadCN width and padding */}
        <SheetHeader>
          <SheetTitle>{product ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {product ? "Update the details of this product" : "Create a new product"}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">

          <div className="space-y-6"> {/* Standard ShadCN gap between elements */}
            <div className="space-y-3">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter product name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="Enter price"
                step="0.01"
                min="0"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
                placeholder="Enter stock quantity"
                min="0"
                className={errors.stock_quantity ? "border-red-500" : ""}
              />
              {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Product Image</Label>
            <div className="flex items-center space-x-4">
              <ImageUpload
                onChange={(file) => setImageFile(file)}
              />
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Existing product image"
                  className="object-cover rounded-md"
                  width={100}
                  height={100}
                />
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : (product ? "Update Product" : "Add Product")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
