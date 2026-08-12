'use client'

import { useState, useRef } from 'react'
import { Upload, X, Check } from 'lucide-react'

interface FileUploadProps {
  onFileSelect?: (file: File) => void
  onPreviewChange?: (url: string | null) => void
  maxSizeMB?: number
  accept?: string
  previewUrl?: string | null
}

export function FileUpload({
  onFileSelect,
  onPreviewChange,
  maxSizeMB = 5,
  accept = 'image/*',
  previewUrl: initialPreviewUrl,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialPreviewUrl || null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setFileName(file.name)
    setUploadProgress(100)
    onFileSelect?.(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setPreview(url)
      onPreviewChange?.(url)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setFileName(null)
    setUploadProgress(0)
    onPreviewChange?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full space-y-4">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? 'border-[#0F5B4F] bg-[#0F5B4F]/5'
              : 'border-[#DCE5E1] bg-white hover:border-[#0F5B4F] hover:bg-[#0F5B4F]/2'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            aria-label="File upload"
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-[#0F5B4F]/10 p-4">
              <Upload className="h-6 w-6 text-[#0F5B4F]" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-[#14221F]">
                Drop your photo here
              </p>
              <p className="mt-1 text-sm text-[#60716D]">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-[#8A9B96]">
              PNG, JPG up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[1.5rem] border border-[#DCE5E1] bg-white shadow-sm">
          <div className="relative h-64 w-full overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {uploadProgress === 100 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0">
                <div className="rounded-full bg-green-500 p-2">
                  <Check className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#14221F]">
                  {fileName || 'Photo uploaded'}
                </p>
                <p className="text-xs text-[#60716D]">
                  Ready to use
                </p>
              </div>
              <button
                onClick={clearPreview}
                type="button"
                className="rounded-full bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="w-full rounded-lg border border-[#0F5B4F] bg-transparent py-2 text-sm font-medium text-[#0F5B4F] transition-colors hover:bg-[#0F5B4F]/5"
            >
              Change Photo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
