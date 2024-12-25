"use client"

import { useState } from "react"
import { useProductsContext } from "@/components/providers/products-provider"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OrdersTablePagination } from "../orders/orders-pagination"
import { createColumns } from "./columns"
import { TableLoading } from "./table-loading"
import { Product } from "@/types/product" // Import Product type
import { ProductModals } from "./product-modals" // Import ProductModals component
import { supabase } from "@/lib/supabase/client" // Import supabase client
import { Sheet, SheetContent } from "@/components/ui/sheet" // Add this import
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateProduct } from "./create-product"

export function ProductsTable() {
  const { products, isLoading, error, refreshProducts } = useProductsContext()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showCreateProduct, setShowCreateProduct] = useState(false)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setShowEditProduct(true)
  }

  const handleCloseEdit = () => {
    setShowEditProduct(false)
    setSelectedProduct(null)
    refreshProducts()
  }

  const handleDelete = (product: Product) => {
    setDeleteProduct(product)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return

    try {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteProduct.id)

      if (deleteError) throw deleteError

      await refreshProducts()
      setDeleteProduct(null)
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl)
  }

  const handleCreateSuccess = () => {
    refreshProducts()
  }

  const columns = createColumns(handleEdit, handleDelete, handleImageClick)

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) return <TableLoading />
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <OrdersTablePagination table={table} />
      <ProductModals
        showEditProduct={showEditProduct}
        handleCloseEdit={handleCloseEdit}
        selectedProduct={selectedProduct}
        deleteProduct={deleteProduct}
        handleDeleteConfirm={handleDeleteConfirm}
        setDeleteProduct={setDeleteProduct}
      />

      {/* Change Dialog to Sheet for image preview */}
      <Sheet open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <SheetContent className="w-full max-w-2xl">
          <div className="relative w-full aspect-square">
            {previewImage && (
              <Image
                src={previewImage}
                alt="Product preview"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                onError={(e) => {
                  console.error("Error loading image:", e);
                  setPreviewImage(null);
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CreateProduct 
        open={showCreateProduct}
        onClose={() => setShowCreateProduct(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
