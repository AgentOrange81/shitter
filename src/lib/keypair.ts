import { Keypair } from "@solana/web3.js";

/**
 * Generate a random keypair (fast)
 */
export function generateRandomKeypair(): Keypair {
  return Keypair.generate();
}