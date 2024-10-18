import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const headers = new Headers();
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Methods', 'POST');
  headers.append('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400, headers });
    }

    const result: any = await new Promise(async (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error: Error, result) => {
        if (result) resolve(result);
        else reject(error);
      });

      const buffer = Buffer.from(await file.arrayBuffer());
      stream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url }, { status: 200, headers });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500, headers });
  }
}