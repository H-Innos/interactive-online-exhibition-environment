interface UploadResponse {
  url?: string;
}

// TODO rename from Image to anything
export async function uploadImage(imageDataUrl: string): Promise<string> {
  try {
    const imageBlob = await (await fetch(imageDataUrl)).blob();
    const formData = new FormData();
    formData.append("file", imageBlob);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: unknown = await response.json();

    if (typeof result === "object" && result !== null && "url" in result) {
      return (result as UploadResponse).url ?? "";
    } else {
      console.error("Unexpected response format:", result);
      return "";
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during file upload:", error.message);
    } else {
      console.error("Unknown error during file upload");
    }
    return "";
  }
}

export async function uploadFile(imgFile: File): Promise<string> {
  const imageDataUrl = URL.createObjectURL(imgFile); // TODO check performance of this
  return await uploadImage(imageDataUrl);
}
