import { Keypair } from "@solana/web3.js";

const targetSuffix = "shit";
const targetBytes = new TextEncoder().encode(targetSuffix);
const targetLength = targetBytes.length;

// Cancellation token - set to true to stop search
let cancelled = false;

export function cancelVanitySearch() {
  cancelled = true;
}

export function resetVanitySearch() {
  cancelled = false;
}

/**
 * Generate a vanity keypair - address ends with specified suffix
 * Returns null if cancelled
 */
export async function generateVanityKeypair(
  onProgress?: (iterations: number) => void
): Promise<Keypair | null> {
  cancelled = false;
  let iterations = 0;
  const reportEvery = 25000;
  
  return new Promise((resolve) => {
    const check = () => {
      if (cancelled) {
        resolve(null);
        return;
      }
      
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
