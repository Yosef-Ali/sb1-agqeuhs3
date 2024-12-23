
import { CustomersTableToolbar } from "@/components/dashboard/customers/customers-toolbar"
import { CustomersTable } from "@/components/dashboard/customers/customers-table"
export const metadata = {
  title: "Customers",
  description: "Manage your customers",
}


export default function CustomersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      </div>
      <div className="space-y-4">
        <CustomersTableToolbar />
        <CustomersTable />
      </div>
    </div>
  )
}
