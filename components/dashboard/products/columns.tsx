import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/types/product" // Import Product type
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import Image from "next/image"
import { ProductActions } from "./product-actions"

const getStatusColor = (status: string) => {
  switch (status) {
    case "in-stock": return "default"
    case "low-stock": return "outline"
    case "out-of-stock": return "destructive"
    default: return "secondary"
  }
}

export const createColumns = (
  onEdit: (product: Product) => void,
  onDelete: (product: Product) => void,
  onImageClick: (imageUrl: string) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "image_url",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image_url") as string
      return imageUrl ? (
        <div className="relative w-12 h-12 cursor-pointer" onClick={() => onImageClick(imageUrl)}>
          <Image
            src={imageUrl}
            alt="Product"
            fill
            className="object-cover rounded"
            sizes="48px"
          />
        </div>
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded" />
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      if (!category) return "-"; // Handle null/undefined case
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="secondary"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    },
  },
  // ...existing columns...
  {
    id: "actions",
    cell: ({ row }) => (
      <ProductActions 
        product={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }
]
