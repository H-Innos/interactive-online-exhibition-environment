
interface UploadResult {
  url: string;
}

export default class FileUploader {
  file: File;

  constructor(file: File) {
    this.file = file;
  }

  upload() {
    console.log("Attempting to upload the file...");

        return new Promise<string>((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', this.file);

          fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
            .then(response => response.json())
            .then((result: UploadResult) => {
              if (result.url) {
                console.log("File uploaded successfully:", result.url);
                resolve(result.url);
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
  }
}