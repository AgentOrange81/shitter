import { Keypair } from "@solana/web3.js";

const targetSuffix = "shit";
const targetBytes = new TextEncoder().encode(targetSuffix);
const targetLength = targetBytes.length;

/**
 * Generate a vanity keypair - address ends with specified suffix
 * Returns null if cancelled
 */
export async function generateVanityKeypair(
  onProgress?: (iterations: number) => void
): Promise<Keypair | null> {
  let iterations = 0;
  const reportEvery = 50000;
  
  return new Promise((resolve) => {
    // Use setImmediate to not block the main thread too much
    const check = () => {
      const keypair = Keypair.generate();
      const pubkeyBytes = keypair.publicKey.toBytes();
      const pubkeySuffix = pubkeyBytes.slice(-targetLength);
      
      let match = true;
      for (let i = 0; i < targetLength; i++) {
        if (pubkeySuffix[i] !== targetBytes[i]) {
          match = false;
          break;
        }
      }
      
      iterations++;
      
      if (match) {
        resolve(keypair);
        return;
      }
      
      if (iterations % reportEvery === 0) {
        onProgress?.(iterations);
      }
      
      // Continue on next tick
      setImmediate(check);
    };
    
    check();
  });
}

/**
 * Check if a public key ends with "shit"
 */
export function publicKeyEndsWithShit(publicKey: string): boolean {
  return publicKey.toLowerCase().endsWith("shit");
}

/**
 * Generate a random keypair (fast)
 */
export function generateRandomKeypair(): Keypair {
  return Keypair.generate();
}
