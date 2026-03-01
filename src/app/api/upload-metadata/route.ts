import { NextRequest, NextResponse } from "next/server";
import { uploadTokenMetadata } from "@/lib/pinata";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const symbol = formData.get("symbol") as string;
    const description = formData.get("description") as string;
    const twitter = formData.get("twitter") as string;
    const telegram = formData.get("telegram") as string;
    const website = formData.get("website") as string;
    const image = formData.get("image") as File | null;

    if (!name || !symbol) {
      return NextResponse.json(
        { success: false, error: "Name and symbol required" },
        { status: 400 }
      );
    }

    // If no image, use placeholder
    if (!image) {
      return NextResponse.json({
        success: true,
        metadataUri: "https://arweave.net/placeholder",
        message: "No image provided, using placeholder",
      });
    }

    // Convert image to buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Pinata
    const result = await uploadTokenMetadata(
      buffer,
      image.name || `${symbol}-image`,
      {
        name,
        symbol,
        description,
        twitter,
        telegram,
        website,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      metadataUri: result.ipfsUri,
      gatewayUrl: result.gatewayUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
