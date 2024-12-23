import { Suspense } from "react"
import { CustomersTable } from "@/components/dashboard/customers/customers-table"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default function CustomersPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Customers"
        text="Manage your customers"
      >
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DashboardHeader>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomersTable />
      </Suspense>
    </DashboardShell>
  )
}
