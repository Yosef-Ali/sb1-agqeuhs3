import { Metadata } from "next"
import { OrdersTable } from "@/components/dashboard/orders/orders-table"
import { OrdersTableToolbar } from "@/components/dashboard/orders/orders-toolbar"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage your orders",
}

export default async function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>
      <div className="space-y-4">
        <OrdersTableToolbar />
        <OrdersTable />
      </div>
    </div>
  )
}
