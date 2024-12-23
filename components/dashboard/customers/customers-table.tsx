"use client"

import { useState } from "react"
import { Customer } from "@/lib/supabase/types"
import { DataTable } from "@/components/ui/data-table"

import { columns } from "./columns"

interface CustomersTableProps {
  data: Customer[]
}

export function CustomersTable({ data }: CustomersTableProps) {
  const [rowSelection, setRowSelection] = useState({})

  return (
    <DataTable
      columns={columns}
      data={data}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  )
}
