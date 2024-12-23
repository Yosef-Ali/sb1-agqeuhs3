"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Customer } from "@/lib/supabase/types"
import { supabase } from "@/lib/supabase/client"

interface CustomerFormProps {
  open: boolean
  onClose: () => void
  customer?: Customer | null
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  onError?: (error: string) => void
}

export function CustomerForm({
  open,
  onClose,
  customer,
  isLoading,
  setIsLoading,
  onError,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>(
    customer || {
      name: "",
      email: "",
      phone: "",
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setIsLoading) return

    try {
      setIsLoading(true)
      
      if (customer?.id) {
        // Update existing customer
        const { error } = await supabase
          .from("customers")
          .update(formData)
          .eq("id", customer.id)

        if (error) throw error
      } else {
        // Create new customer
        const { error } = await supabase
          .from("customers")
          .insert(formData)

        if (error) throw error
      }

      onClose()
    } catch (error) {
      console.error("Error saving customer:", error)
      if (onError) {
        onError(error instanceof Error ? error.message : "Failed to save customer")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>
          <DialogDescription>
            {customer
              ? "Make changes to the customer details here."
              : "Add a new customer to your database."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter customer name"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter customer email"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
