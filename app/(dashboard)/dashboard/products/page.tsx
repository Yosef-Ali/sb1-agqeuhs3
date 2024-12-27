import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Metadata } from "next"
import { ProductsTable } from "@/components/dashboard/products/products-table"
import { ProductsTableToolbar } from "@/components/dashboard/products/products-toolbar"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products and inventory.",
}

export default async function ProductsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      </div>
      <div className="space-y-4">
        <ProductsTableToolbar />
        <ProductsTable serverProducts={data ?? []} />
      </div>
    </div>
  )
}
