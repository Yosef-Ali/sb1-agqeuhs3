"use client"

import { useState, useEffect, FormEvent } from "react"
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
import { useProducts, ProductWithImage } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

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
  unit?: string;
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
  const [stockQuantity, setStockQuantity] = useState<number | undefined>(undefined)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined) // Initialize as undefined
  const [errors, setErrors] = useState<FormErrors>({})
  const [unit, setUnit] = useState("") // Add state for unit
  const { createProduct, updateProduct, isLoading } = useProducts(undefined) // Pass undefined explicitly
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories()

  useEffect(() => {
    if (product) {
      console.log('Product data:', product); // Debug product data
      setName(product.name || "")
      setDescription(product.description || "")
      setPrice(product.price?.toString() || "")
      setCategory(product.category || "") // Use category
      // Fix stock quantity initialization
      const stockQty = product.stock_quantity !== null && product.stock_quantity !== undefined
        ? product.stock_quantity
        : undefined;
      console.log('Setting stock quantity:', stockQty); // Debug stock quantity
      setStockQuantity(stockQty);
      setUnit(product.unit || "")
      setImageUrl(product.image_url || undefined)
    } else {
      resetForm()
    }
  }, [product, open])

  const resetForm = async () => {
    setName("")
    setDescription("")
    setPrice("")
    setCategory("")
    setStockQuantity(undefined)
    setImageFile(null)
    setImageUrl(undefined) // Set as undefined
    setUnit("") // Reset unit

    // Wait for state updates to complete
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!category) {
      newErrors.category = "Category is required"
    }
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Valid price is required"
    }
    const stockNum = stockQuantity !== undefined ? stockQuantity : NaN
    if (isNaN(stockNum) || stockNum < 0) {
      newErrors.stock_quantity = "Valid stock quantity is required"
    }
    if (!description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!unit.trim()) {
      newErrors.unit = "Unit is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!validateForm()) return

    console.log('Stock quantity before parsing:', stockQuantity);

    try {
      const productData: ProductWithImage = {
        name,
        description,
        price: parseFloat(price),
        category: category || null, // Use category
        unit,
        stock_quantity: stockQuantity === undefined ? 0 : stockQuantity,
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
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-1/3">
                  <Label htmlFor="name">Product Name</Label>
                </TableCell>
                <TableCell>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter product name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Label htmlFor="category">Category</Label>
                </TableCell>
                <TableCell>
                  {isLoadingCategories ? (
                    <p>Loading categories...</p>
                  ) : categoriesError ? (
                    <p className="text-red-500 text-sm mt-1">{categoriesError}</p>
                  ) : (
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </TableCell>
              </TableRow>

              {/* Continue the same pattern for other fields */}
              <TableRow>
                <TableCell>
                  <Label htmlFor="description">Description</Label>
                </TableCell>
                <TableCell>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </TableCell>
              </TableRow>

              {/* Add similar TableRows for price, stock quantity, and unit */}
              <TableRow>
                <TableCell>
                  <Label htmlFor="price">Price</Label>
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Label htmlFor="stock">Stock Quantity</Label>
                </TableCell>
                <TableCell>
                  <Input
                    id="stock"
                    type="number"
                    value={stockQuantity === undefined ? '' : stockQuantity.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      console.log('Stock quantity changed:', value);
                      setStockQuantity(isNaN(value) ? undefined : value);
                    }}
                    required
                    placeholder="Enter stock quantity"
                    min={0}
                    className={errors.stock_quantity ? "border-red-500" : ""}
                  />
                  {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>}
                  {/* Debug display */}
                  <p className="text-xs text-gray-500 mt-1">
                    Raw value: {JSON.stringify(stockQuantity)}
                  </p>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Label htmlFor="unit">Unit</Label>
                </TableCell>
                <TableCell>
                  <Input
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    required
                    placeholder="Enter unit (e.g., kg, pcs)"
                    className={errors.unit ? "border-red-500" : ""}
                  />
                  {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

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
