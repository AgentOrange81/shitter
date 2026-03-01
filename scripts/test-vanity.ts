// Quick test of vanity generation
import { Keypair } from "@solana/web3.js";

const targetSuffix = "shit";
const targetBytes = new TextEncoder().encode(targetSuffix);
const targetLength = targetBytes.length;

console.log("Testing vanity generation...");

let iterations = 0;
const start = Date.now();

while (iterations < 500000) {
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
    console.log(`Found after ${iterations} iterations in ${Date.now() - start}ms`);
    console.log(`Mint: ${keypair.publicKey.toBase58()}`);
    break;
  }
  
  if (iterations % 100000 === 0) {
    console.log(`Checked ${iterations}...`);
  }
}

if (iterations >= 500000) {
  console.log(`Not found in 500k tries. Last iteration: ${iterations}`);
}
