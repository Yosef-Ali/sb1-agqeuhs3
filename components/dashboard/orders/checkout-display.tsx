import { CartItem } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Printer, Share } from "lucide-react"
import { Receipt } from "./receipt"

interface CheckoutDisplayProps {
  items: CartItem[]
  subtotal: number
  phoneNumber: string
  setPhoneNumber: (value: string) => void
  showReceipt: boolean
  setShowReceipt: (value: boolean) => void
  onNewOrder: () => void
  clearCart: () => void
}

export function CheckoutDisplay({
  items,
  subtotal,
  phoneNumber,
  setPhoneNumber,
  showReceipt,
  setShowReceipt,
  onNewOrder,
  clearCart,
}: CheckoutDisplayProps) {
  return (
    <div className="border-t">
      <div className="p-6">
        <Receipt 
          items={items}
          subtotal={subtotal}
          phoneNumber={phoneNumber}
        />
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1" 
            onClick={() => window.print()}
            variant="outline"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              const receiptText = document.querySelector('pre')?.textContent
              if (receiptText) {
                window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(receiptText)}`)
              }
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
