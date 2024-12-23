"use client"

import { useState, useEffect, useCallback } from "react"
import { Customer } from "@/lib/supabase/types"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ColumnDef,
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
import { Button } from "@/components/ui/button"
import { OrdersTablePagination } from "../orders/orders-pagination"
import { DeleteConfirmation } from "@/components/ui/delete-confirmation"
import { CustomerForm } from "./customer-form"
import { supabase } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export function CustomersTable() {
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (err) {
      console.error("Error fetching customers:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch customers")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "MMM d, yyyy")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleEdit(customer)}
                disabled={isSubmitting}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(customer)}
                className="text-red-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleEdit = async (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowEditCustomer(true)
  }

  const handleFormClose = async () => {
    setShowEditCustomer(false)
    setSelectedCustomer(null)
    await fetchCustomers() // Refresh the list
  }

  const handleDelete = (customer: Customer) => {
    setDeleteCustomer(customer)
  }

  const confirmDelete = async () => {
    if (!deleteCustomer) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", deleteCustomer.id)

      if (error) throw error

      await fetchCustomers() // Refresh the list
    } catch (err) {
      console.error("Error deleting customer:", err)
      setError(err instanceof Error ? err.message : "Failed to delete customer")
    } finally {
      setIsSubmitting(false)
      setDeleteCustomer(null)
    }
  }

  const table = useReactTable({
    data: customers,
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
      rowSelection: rowSelection as Record<string, boolean>,
    },
  })

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="relative min-h-[400px]">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <>
            <div className="w-full">
              {isLoading ? (
                <div className="w-full space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 w-full">
                      <Skeleton className="h-12 flex-1" />
                      <Skeleton className="h-12 w-[200px]" />
                      <Skeleton className="h-12 w-[150px]" />
                      <Skeleton className="h-12 w-[100px]" />
                    </div>
                  ))}
                </div>
              ) : customers.length === 0 ? (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  No customers found
                </div>
              ) : (
                <Table className="border">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
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
              )}
            </div>
          </>
        )}
      </div>
      <OrdersTablePagination table={table} />
      {showEditCustomer && (
        <CustomerForm
          open={showEditCustomer}
          onClose={handleFormClose}
          customer={selectedCustomer}
          isLoading={isSubmitting}
          setIsLoading={setIsSubmitting}
        />
      )}
      <DeleteConfirmation
        open={!!deleteCustomer}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        loading={isSubmitting}
      />
    </div>
  )
}
