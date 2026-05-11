import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      return NextResponse.json({ error: "CLOUDINARY_CLOUD_NAME is required." }, { status: 500 });
    }

    const signedMode = !uploadPreset;
    if (signedMode && (!apiKey || !apiSecret)) {
      return NextResponse.json(
        {
          error:
            "Configure CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, or set CLOUDINARY_UPLOAD_PRESET for unsigned uploads.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file field in multipart form data." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mime = file.type || "application/octet-stream";
    const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

    const folder = process.env.CLOUDINARY_FOLDER ?? "stock-flow";

    const result = uploadPreset
      ? await cloudinary.uploader.unsigned_upload(dataUri, uploadPreset, {
          folder,
        })
      : await cloudinary.uploader.upload(dataUri, { folder });

    if (!result.secure_url) {
      return NextResponse.json({ error: "Upload succeeded but no secure_url returned." }, { status: 500 });
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
