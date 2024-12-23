"use client"

import { useState } from "react"
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { CustomerForm } from "./customer-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/dashboard/orders/orders-view-options"
import { useToast } from "@/hooks/use-toast"

interface DataTableToolbarProps<TData> {
  table?: Table<TData>
}

export function CustomersTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    })
    setIsLoading(false)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter customers..."
          value={(table?.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table && table.getState().columnFilters.length > 0 && (
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
          onClick={() => setShowAddCustomer(true)}
          disabled={isLoading}
        >
          <PlusIcon className="h-4 w-4" />
          <span className="ml-2">{isLoading ? "Loading..." : "Add Customer"}</span>
        </Button>
        {table && <DataTableViewOptions table={table} />}
      </div>
      <CustomerForm
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onError={handleError}
      />
    </div>
  )
}
