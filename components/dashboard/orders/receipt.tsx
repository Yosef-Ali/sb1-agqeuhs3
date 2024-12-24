import { CartItem } from "@/lib/store/cart-store"

interface ReceiptProps {
  items: CartItem[]
  subtotal: number
  phoneNumber: string
}

export function Receipt({ items, subtotal, phoneNumber }: ReceiptProps) {
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
  
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
RECEIPT #${orderNumber}
Date: ${formatDate()}
------------------------
${items.map(item => `
${item.customer}
Order ID: ${item.id}
Quantity: ${item.quantity} x $${item.total.toFixed(2)}
Amount: $${(item.quantity * item.total).toFixed(2)}
`).join('\n')}
------------------------
Items: ${items.reduce((sum, item) => sum + item.quantity, 0)}
Subtotal: $${subtotal.toFixed(2)}
Tax (10%): $${tax.toFixed(2)}
------------------------
Total: $${total.toFixed(2)}
------------------------
Contact: ${phoneNumber}
Thank you for your order!
  `.trim()

  return (
    <pre className="font-mono text-sm whitespace-pre-wrap bg-white p-4 rounded border">
      {receiptContent}
    </pre>
  )
}
