import { Metadata } from "next"
import { ProductsContent } from "./products-content"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products",
}

export default function ProductsPage() {
  return <ProductsContent />
}
