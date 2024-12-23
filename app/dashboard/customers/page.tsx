"use client"

import { Suspense, useState } from "react"
import { CustomerForm } from "@/components/dashboard/customers/customer-form"
import { CustomersTable } from "@/components/dashboard/customers/customers-table"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default function CustomersPage() {
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl md:text-4xl">Customers</h1>
          <p className="text-lg text-muted-foreground">Manage your customers</p>
        </div>
        <Button onClick={() => setShowAddCustomer(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomersTable />
      </Suspense>
      {showAddCustomer && (
        <CustomerForm
          open={showAddCustomer}
          onClose={() => setShowAddCustomer(false)}
          isLoading={false}
          setIsLoading={() => {}}
        />
      )}
    </div>
  )
}
