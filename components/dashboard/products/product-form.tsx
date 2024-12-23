"use client"

import { useState, useEffect, FormEvent } from "react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
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

import { Product } from "@/types/product"
import { Button } from "@/components/ui/button"

interface ProductFormProps {
  open: boolean
  onClose: () => void
  product?: Product | null
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  onError?: (error: string) => void
}

export function ProductForm({
  open,
  onClose,
  product,
  isLoading,
  setIsLoading,
  onError,
}: ProductFormProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setName(product.name || "")
      setDescription(product.description || "")
      setPrice(product.price?.toString() || "")
      setCategory(product.category || "")
      setStockQuantity(product.stock_quantity?.toString() || "")
      setImageUrl(product.image_url || null)
    } else {
      resetForm()
    }
  }, [product, open])

  const resetForm = () => {
    setName("")
    setDescription("")
    setPrice("")
    setCategory("")
    setStockQuantity("")
    setImageFile(null)
    setImageUrl(null)
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `product-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Supabase storage error:', error)
      onError?.('Failed to upload image')
      return null
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (setIsLoading) setIsLoading(true)

    try {
      // Upload image if a new file is selected
      let finalImageUrl = imageUrl
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile)
        if (uploadedImageUrl) finalImageUrl = uploadedImageUrl
      }

      const productData = {
        name,
        description,
        price: parseFloat(price),
        category,
        stock_quantity: parseInt(stockQuantity),
        image_url: finalImageUrl,
      }

      let result;
      if (product) {
        // Update existing product
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)
      } else {
        // Add new product
        result = await supabase
          .from("products")
          .insert(productData)
      }

      if (result.error) throw result.error

      toast({
        title: product ? "Product Updated" : "Product Added",
        description: `${name} has been successfully ${product ? 'updated' : 'added'}.`,
      })

      resetForm()
      onClose()
    } catch (error) {
      console.error("Error saving product:", error)
      onError?.(`Failed to ${product ? 'update' : 'add'} product`)
    } finally {
      if (setIsLoading) setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{product ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {product ? "Update the details of this product" : "Create a new product"}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">

          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              />
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
              />
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ImageUpload
                  onChange={(file) => setImageFile(file)}
                />
              </div>
              {imageUrl && (
                <div className="flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt="Existing product image"
                    className="max-w-[200px] max-h-[200px] object-cover rounded-md"
                  />
                </div>
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
