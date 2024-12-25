'use client';

import { ProductsTable } from "@/components/dashboard/products/products-table"
import { ProductsTableToolbar } from "@/components/dashboard/products/products-toolbar"
import { ProductsProvider } from "@/components/providers/products-provider"

export function ProductsContent() {
  return (
    <ProductsProvider>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        </div>
        <div className="space-y-4">
          <ProductsTableToolbar />
          <ProductsTable />
        </div>
      </div>
    </ProductsProvider>
  )
}
