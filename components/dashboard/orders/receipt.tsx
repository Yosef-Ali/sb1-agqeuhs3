import { CartItem } from "@/lib/store/cart-store"

interface ReceiptProps {
  items: CartItem[]
  subtotal: number
  phoneNumber: string
}

export function Receipt({ items, subtotal, phoneNumber }: ReceiptProps) {
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const receiptContent = `
ORDER RECEIPT
${formatDate()}
------------------------
${items.map(item => `
${item.customer}
${item.id}
Qty: ${item.quantity} x $${item.total.toFixed(2)}
Subtotal: $${(item.quantity * item.total).toFixed(2)}
`).join('\n')}
------------------------
Total Items: ${items.reduce((sum, item) => sum + item.quantity, 0)}
Subtotal: $${subtotal.toFixed(2)}
------------------------
Phone: ${phoneNumber}
  `.trim()

  return (
    <pre className="font-mono text-sm whitespace-pre-wrap bg-white p-4 rounded border">
      {receiptContent}
    </pre>
  )
}
