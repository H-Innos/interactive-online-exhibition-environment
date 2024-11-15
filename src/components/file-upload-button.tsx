'use client'

import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from "~/components/ui/button"

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void
  accept?: string
  disabled?: boolean
}

export default function FileUploadButton({ 
  onFileSelect, 
  accept = '*',
  disabled = false
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    onFileSelect(file);
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={false}
        className="hidden"
        aria-label="File upload"
      />
      <Button 
        variant='outline'
        type='button'
        onClick={handleButtonClick}
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        <Upload className="w-4 h-4" />
        <span>Upload File</span>
      </Button>
    </div>
  )
}