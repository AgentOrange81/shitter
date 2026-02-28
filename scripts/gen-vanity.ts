import { Keypair } from "@solana/web3.js";
import fs from "fs";

// Grind for vanity keypairs
function grindVanityKeypair(suffix: string): Keypair | null {
  const targetSuffix = suffix.toLowerCase();
  const targetBytes = new TextEncoder().encode(targetSuffix);
  const targetLength = targetBytes.length;
  
  let iterations = 0;
  const maxIterations = 500000;
  
  while (iterations < maxIterations) {
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
    
    if (match) {
      return keypair;
    }
    
    iterations++;
  }
  
  return null;
}

async function main() {
  // Try multiple suffixes to get 10
  const suffixes = ["shit", "hit", "sit", "pit", "xit", "shat", "shot", "shet", "shut", "shat"];
  const vanityMints: Array<{ publicKey: string; privateKey: number[]; suffix: string }> = [];
  
  console.log(`Generating 10 vanity mints...\n`);
  
  for (const suffix of suffixes) {
    if (vanityMints.length >= 10) break;
    
    console.log(`Trying suffix "${suffix}"...`);
    const result = grindVanityKeypair(suffix);
    
    if (result) {
      console.log(`✅ Found: ${result.publicKey.toBase58()} (ends in ${suffix})`);
      vanityMints.push({
        publicKey: result.publicKey.toBase58(),
        privateKey: Array.from(result.secretKey),
        suffix,
      });
    } else {
      console.log(`❌ Could not find "${suffix}" in 500k tries`);
    }
  }
  
  if (vanityMints.length === 0) {
    console.log("\nFalling back to random mints...");
    for (let i = 0; i < 10; i++) {
      const keypair = Keypair.generate();
      vanityMints.push({
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Array.from(keypair.secretKey),
        suffix: "random",
      });
    }
  }
  
  // Save to file
  const data = {
    generated: new Date().toISOString(),
    count: vanityMints.length,
    mints: vanityMints,
  };
  
  fs.writeFileSync("./vanity-mints.json", JSON.stringify(data, null, 2));
  console.log(`\n✅ Saved ${vanityMints.length} mints to vanity-mints.json`);
  
  // Public only
  const publicOnly = {
    generated: new Date().toISOString(),
    count: vanityMints.length,
    mints: vanityMints.map(m => m.publicKey),
  };
  
  fs.writeFileSync("./vanity-mints-public.json", JSON.stringify(publicOnly, null, 2));
  console.log(`✅ Saved public keys to vanity-mints-public.json`);
}

main().catch(console.error);
