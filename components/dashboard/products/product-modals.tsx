import { ProductForm } from "./product-form"
import { DeleteConfirmation } from "@/components/ui/delete-confirmation"
import { Product } from "@/types/product"

interface ProductModalsProps {
  showEditProduct: boolean
  handleCloseEdit: () => void
  selectedProduct: Product | null
  deleteProduct: Product | null
  handleDeleteConfirm: () => void
  setDeleteProduct: (product: Product | null) => void
}

export function ProductModals({
  showEditProduct,
  handleCloseEdit,
  selectedProduct,
  deleteProduct,
  handleDeleteConfirm,
  setDeleteProduct,
}: ProductModalsProps) {
  return (
    <>
      <ProductForm
        open={showEditProduct}
        onClose={handleCloseEdit}
        product={selectedProduct}
      />
      <DeleteConfirmation
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        description="Are you sure you want to delete this product?"
      />
    </>
  )
}
