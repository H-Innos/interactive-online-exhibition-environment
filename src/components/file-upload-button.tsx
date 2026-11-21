"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { t } from "i18next";

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export default function FileUploadButton({
  onFileSelect,
  accept = "*",
  disabled = false,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        <Upload className="h-4 w-4" />
        <p>{t("fileUpload")}</p>
      </Button>
    </div>
  );
}
