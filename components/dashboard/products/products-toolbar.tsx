"use client"

import { useState } from "react"
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { ProductForm } from "./product-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTableViewOptions } from "@/components/dashboard/orders/orders-view-options"

interface DataTableToolbarProps<TData> {
  table?: Table<TData>
}

export function ProductsTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [showAddProduct, setShowAddProduct] = useState(false)
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter products..."
          value={(table?.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select
          value={(table?.getColumn("status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table?.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        {table?.getState().columnFilters.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setShowAddProduct(true)}
        >
          <PlusIcon className="h-4 w-4" />
          <span className="ml-2">Add Product</span>
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      <ProductForm open={showAddProduct} onClose={() => setShowAddProduct(false)} />
    </div>
  )
}
