"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ImagePlus, X } from "lucide-react"

interface ImageUploadProps {
  onChange: (value: string) => void
  value: string
  disabled?: boolean
}

export function ImageUpload({
  onChange,
  value,
  disabled
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true)
      
      const file = e.target.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)
      
      // TODO: Implement your image upload API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      onChange(data.url)
      
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setLoading(false)
    }
  }, [onChange])

  return (
    <div className="relative">
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onChange('')}
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Product image"
              src={value}
            />
          </div>
        )}
        {!value && (
          <Button
            type="button"
            disabled={disabled}
            variant="secondary"
            onClick={() => document.getElementById('imageUpload')?.click()}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        )}
      </div>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={disabled || loading}
      />
    </div>
  )
}
