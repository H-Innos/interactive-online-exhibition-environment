import type { FileLoader, UploadResponse } from "@ckeditor/ckeditor5-upload";


export default class FileUploader {
    loader: FileLoader;
    constructor(loader: FileLoader) {
      this.loader = loader; 
    }
  
    upload() {
      console.log("Attempting to upload the file...");
      return this.loader.file
        .then((file: File | null) => {
          if (!file) {
            console.error("No file found.");
            throw new Error('File is not available.');
          }
  
          console.log("File found:", file);
  
          return new Promise<UploadResponse>((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file as File);
  
            fetch('/api/upload', {
              method: 'POST',
              body: formData,
            })
              .then(response => response.json())
              .then(result => {
                if (result.url) {
                  console.log("File uploaded successfully:", result.url);
                  resolve({
                    default: result.url,
                  });
                } else {
                  console.error("No URL in the response.");
                  reject(new Error('No URL in the response'));
                }
              })
              .catch((error: Error) => {
                console.error("Error during file upload:", error);
                reject(error);
              });
          });
        })
        .catch((error: Error) => {
          console.error('Upload failed:', error);
          return Promise.reject(error);
        });
    }
  }