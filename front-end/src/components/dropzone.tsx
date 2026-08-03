'use client'

import { useCallback, useRef, useState, type DragEvent } from 'react'
import { Upload, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropzoneProps {
  onUpload: (file: File) => Promise<void>
  disabled?: boolean
  accept?: string
}

export function Dropzone({ onUpload, disabled, accept = 'image/*' }: DropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return
      setLoading(true)
      await onUpload(file)
      setLoading(false)
      if (fileRef.current) fileRef.current.value = ''
    },
    [onUpload],
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        className="hidden"
      />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
          dragging
            ? 'border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-900/20'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-slate-500 dark:hover:bg-slate-800',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
            <span className="text-sm text-gray-500 dark:text-slate-400">Uploading...</span>
          </div>
        ) : (
          <>
            <div className="mb-3 rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
              {dragging ? (
                <ImageIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              ) : (
                <Upload className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
              {dragging ? 'Drop image here' : 'Drag & drop an image here'}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">or click to browse</p>
          </>
        )}
      </div>
    </>
  )
}
