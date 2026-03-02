const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  image: string;
  created_by?: string;
  tags?: string[];
  extensions?: {
    twitter?: string;
    telegram?: string;
    website?: string;
  };
}

interface UploadResult {
  success: boolean;
  ipfsUri?: string;
  gatewayUrl?: string;
  error?: string;
}

async function uploadToPinata(data: FormData): Promise<{ IpfsHash: string } | null> {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    console.warn("Pinata credentials not configured");
    return null;
  }

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`Pinata error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Pinata upload error:", error);
    return null;
  }
}

/**
 * Upload an image file to IPFS via Pinata
 */
export async function uploadImage(imageBuffer: Buffer, filename: string): Promise<UploadResult> {
  const formData = new FormData();
  // Use Uint8Array which works better with Blob
  const uint8Array = new Uint8Array(imageBuffer);
  formData.append("file", new Blob([uint8Array]), filename);

  const result = await uploadToPinata(formData);

  if (!result) {
    return { success: false, error: "Pinata upload failed" };
  }

  return {
    success: true,
    ipfsUri: `ipfs://${result.IpfsHash}`,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
  };
}

/**
 * Upload metadata JSON to IPFS via Pinata
 */
export async function uploadMetadata(metadata: TokenMetadata): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", JSON.stringify(metadata));

  const result = await uploadToPinata(formData);

  if (!result) {
    return { success: false, error: "Pinata upload failed" };
  }

  return {
    success: true,
    ipfsUri: `ipfs://${result.IpfsHash}`,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
  };
}

/**
 * Full flow: upload image + metadata, return metadata URI
 */
export async function uploadTokenMetadata(
  imageBuffer: Buffer,
  imageFilename: string,
  tokenData: {
    name: string;
    symbol: string;
    description?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
  }
): Promise<UploadResult> {
  // 1. Upload image first
  const imageResult = await uploadImage(imageBuffer, imageFilename);

  if (!imageResult.success) {
    return { success: false, error: `Image upload failed: ${imageResult.error}` };
  }

  // 2. Create metadata with image URL
  const metadata: TokenMetadata = {
    name: tokenData.name,
    symbol: tokenData.symbol,
    description: tokenData.description,
    image: imageResult.ipfsUri!,
    created_by: "Shitter",
    tags: ["shitter", "solana", "meme-coin"],
    extensions: {
      twitter: tokenData.twitter,
      telegram: tokenData.telegram,
      website: tokenData.website,
    },
  };

  // 3. Upload metadata
  const metadataResult = await uploadMetadata(metadata);

  if (!metadataResult.success) {
    return { success: false, error: `Metadata upload failed: ${metadataResult.error}` };
  }

  return metadataResult;
}

/**
 * Check if Pinata is configured
 */
export function isPinataConfigured(): boolean {
  return !!(PINATA_API_KEY && PINATA_API_SECRET);
}
