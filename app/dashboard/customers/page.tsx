import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { CustomersTable } from "@/components/dashboard/customers/customers-table"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const supabase = createServerClient()
  
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return <div>Error loading customers</div>
  }

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
        <CustomersTable customers={customers || []} />
      </Suspense>
    </DashboardShell>
  )
}
