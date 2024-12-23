"use client"

import { Suspense, useState } from "react"
import { CustomerForm } from "@/components/dashboard/customers/customer-form"
import { CustomersTable } from "@/components/dashboard/customers/customers-table"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default function CustomersPage() {
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  return (
    <div className="grid items-start gap-8">
      <DashboardHeader heading="Customers" text="Manage your customers">
        <Button onClick={() => setShowAddCustomer(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DashboardHeader>
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
