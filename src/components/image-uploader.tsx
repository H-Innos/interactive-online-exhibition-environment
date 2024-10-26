interface UploadResponse {
    url?: string;
}

export async function uploadImage(imageDataUrl: string): Promise<string | null> {
    try {
        const imageBlob = await (await fetch(imageDataUrl)).blob();
        const formData = new FormData();
        formData.append('file', imageBlob);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result: UploadResponse = await response.json();
        return result.url ?? null;
    } catch (error) {
        console.error("Error during file upload:", error);
        return null;
    }
}