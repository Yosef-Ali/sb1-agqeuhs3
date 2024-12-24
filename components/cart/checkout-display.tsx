"use client"

import { CartItem } from "@/types/cart"  // Update this import
import { Printer, Share, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { toast } from "sonner"

interface CheckoutDisplayProps {
  items: CartItem[]
  subtotal: number
  clearCart: () => void
  onBack: () => void
  phone: string
}

export function CheckoutDisplay({
  items,
  subtotal,
  clearCart,
  onBack,
  phone
}: CheckoutDisplayProps) {
  const [showPOSReceipt, setShowPOSReceipt] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const currentDate = new Date().toLocaleDateString()
  const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')

  const handleCheckout = async () => {
    try {
      setIsProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setShowPOSReceipt(true)
      clearCart()
      toast.success("Order placed successfully!")
    } catch (err) {
      toast.error("Checkout failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const receiptContent = (
    <div className="receipt-content font-mono text-xs leading-tight">
      {/* Store Header - Two columns */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold">STORE NAME</h2>
          <div className="text-[10px] text-gray-600">
            <p>123 Store Street</p>
            <p>City, State 12345</p>
          </div>
        </div>
        <div className="text-right text-[10px] text-gray-600 self-end">
          <p>Tel: (123) 456-7890</p>
          <p>Order #{orderNumber}</p>
          <p>{currentDate}</p>
        </div>
      </div>

      {/* Order Info - More compact */}
      <div className="text-center mb-4 text-[11px]">
        <p className="font-medium">Order #{orderNumber}</p>
        <p className="text-gray-600">{currentDate}</p>
        {phone && <p className="text-gray-600">Customer: {phone}</p>}
      </div>

      <Separator className="border-dashed my-3" />

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-4 gap-1 text-xs">
            <div className="col-span-2">{item.customer}</div>
            <div className="text-right">{item.quantity}x</div>
            <div className="text-right">
              ${(item.total * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <Separator className="border-dashed" />

      {/* Totals */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-1 pt-2">
        <p>Thank you for your purchase!</p>
        <p className="text-xs">Please visit again</p>
        <p className="text-xs">{new Date().toLocaleString()}</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 py-4 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <SheetTitle>Receipt</SheetTitle>
        </div>
      </SheetHeader>

      {/* Receipt Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto bg-white p-6 shadow-sm border rounded-lg">
          {receiptContent}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t p-6">
        <div className="flex gap-4">
          <Button
            className="flex-1"
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow?.document.write(`
                <html>
                  <head>
                    <title>Receipt</title>
                    <style>
                      body { font-family: monospace; padding: 20px; }
                      .receipt-content { max-width: 300px; margin: 0 auto; }
                    </style>
                  </head>
                  <body>
                    <div class="receipt-content">
                      ${document.querySelector('.receipt-content')?.innerHTML}
                    </div>
                  </body>
                </html>
              `);
              printWindow?.document.close();
              printWindow?.print();
            }}
            variant="outline"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              const receiptText = `
STORE NAME
${orderNumber} - ${currentDate}
${phone ? `Customer: ${phone}\n` : ''}
${items.map(item =>
                `${item.customer} x${item.quantity}: $${(item.total * item.quantity).toFixed(2)}`
              ).join('\n')}

Total: $${subtotal.toFixed(2)}

Thank you for your purchase!`;
              window.open(`https://wa.me/?text=${encodeURIComponent(receiptText)}`);
            }}
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
