'use client'

import { ProductsTable } from "./products-table"
import { ProductsTableToolbar } from "./products-toolbar"

export function ProductsContent() {
  return (
    <aside className="w-64 bg-gray-800 text-white border-r border-gray-700 p-4">
      <div className="mb-4">
        <a href="/" className="text-2xl font-bold">Logo</a>
      </div>
      <nav className="space-y-2">
        <a href="/products" className="block py-2 px-4 rounded hover:bg-gray-700">Products</a>
        <a href="/categories" className="block py-2 px-4 rounded hover:bg-gray-700">Categories</a>
        <a href="/orders" className="block py-2 px-4 rounded hover:bg-gray-700">Orders</a>
      </nav>
      <div className="mt-auto">
        <button className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700">Cart</button>
        <div className="mt-2 text-center">
          <span>User Info</span>
        </div>
      </div>
    </aside>
  )
}
