import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const options: UploadApiOptions = {
  resource_type: "auto",
};

export async function POST(request: Request) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Methods", "POST");
  headers.append("Access-Control-Allow-Headers", "Content-Type");

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400, headers },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (result) resolve(result);
          else reject(new Error("Upload failed"));
        },
      );

      stream.end(buffer);
    });

    return NextResponse.json(
      { url: result.secure_url },
      { status: 200, headers },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("File upload error:", error.message);
    } else {
      console.error("Unknown file upload error");
    }
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500, headers },
    );
  }
}
