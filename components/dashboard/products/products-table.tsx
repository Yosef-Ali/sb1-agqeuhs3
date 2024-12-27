"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
import { Sheet, SheetContent } from "@/components/ui/sheet" // Add this import
import Image from "next/image"
import { useProducts } from '@/hooks/use-products'  // Update import
import { useToast } from '@/hooks/use-toast'
import React from "react"
import { useCategories } from '@/hooks/use-categories'

interface ProductsTableProps {
  serverProducts: Product[]
}

export function ProductsTable({ serverProducts }: ProductsTableProps) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const {
    products: fetchedProducts,
    isLoading,
    error,
    deleteProduct: deleteProductOp,
    refreshProducts,
  } = useProducts(serverProducts) // Pass serverProducts here
  const { toast } = useToast()
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories()


  const products = serverProducts || fetchedProducts || []


  // 4. Define handlers
  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowEditProduct(true)
  }, []) // Empty dependency array since setState functions are stable

  const handleCloseEdit = () => {
    setShowEditProduct(false)
    setSelectedProduct(null)
    refreshProducts()
  }

  const handleDelete = useCallback((product: Product) => {
    setDeleteProduct(product)
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteProduct?.id) return

    try {
      await deleteProductOp(deleteProduct.id)
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
      await refreshProducts()
      setDeleteProduct(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleImageClick = useCallback((imageUrl: string) => {
    setPreviewImage(imageUrl)
  }, []) // Empty dependency array since setPreviewImage is stable

  
  const columns = useMemo(() => createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onImageClick: handleImageClick,
    categories: categories || []
  }), [categories, handleEdit, handleDelete, handleImageClick])

  // 6. Create table
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

  // 7. Render table
  return (
    <div className="space-y-4">
      {
        isLoading || isLoadingCategories ? (
          <TableLoading />
        ) : error ? (
          <div>Error: {error}</div>
        ) : categoriesError ? (
          <div>Error loading categories: {categoriesError}</div>
        ) : !categories?.length ? (
          <div>No categories available</div>
        ) : (
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
        )
      }
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
    </div>
  )
}

