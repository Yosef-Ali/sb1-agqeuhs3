"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus } from "lucide-react"

interface ImageUploadProps {
  onChange: (file: File | null) => void
  disabled?: boolean
}

export function ImageUpload({
  onChange,
  disabled
}: ImageUploadProps) {
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
    }
  }, [onChange])

  return (
    <div className="relative">
      <div className="mb-4 flex items-center gap-4">
        <Button
          type="button"
          disabled={disabled}
          variant="secondary"
          onClick={() => document.getElementById('imageUpload')?.click()}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Select Image
        </Button>
      </div>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={disabled}
      />
    </div>
  )
}
