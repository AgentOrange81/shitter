import { Keypair } from "@solana/web3.js";
import fs from "fs";

const targetSuffix = "shit";
const targetBytes = Buffer.from(targetSuffix);
const targetLength = targetBytes.length;

function grindVanityKeypair(): Keypair | null {
  let iterations = 0;
  const reportEvery = 100000;
  
  while (true) {
    const keypair = Keypair.generate();
    const pubkeyBytes = keypair.publicKey.toBytes();
    const pubkeySuffix = pubkeyBytes.slice(-targetLength);
    
    let match = true;
    for (let j = 0; j < targetLength; j++) {
      if (pubkeySuffix[j] !== targetBytes[j]) {
        match = false;
        break;
      }
    }
    
    iterations++;
    
    if (match) {
      console.log(`\n✅ FOUND after ${iterations.toLocaleString()} iterations!`);
      return keypair;
    }
    
    if (iterations % reportEvery === 0) {
      console.log(`Progress: ${iterations.toLocaleString()}`);
    }
  }
}

async function main() {
  console.log(`Generating vanity mints ending in "${targetSuffix}"...`);
  console.log(`This will take a while. Press Ctrl+C to stop.\n`);
  
  const vanityMints: Array<{ publicKey: string; privateKey: string }> = [];
  
  while (vanityMints.length < 10) {
    console.log(`\n--- Generating #${vanityMints.length + 1}/10 ---`);
    
    const result = grindVanityKeypair();
    
    if (!result) {
      console.log(`Failed to generate, retrying...`);
      continue;
    }
    
    console.log(`Found: ${result.publicKey.toBase58()}`);
    vanityMints.push({
      publicKey: result.publicKey.toBase58(),
      privateKey: Buffer.from(result.secretKey).toString("base64")
    });
    
    // Save after each
    const privateData = {
      generated: new Date().toISOString(),
      count: vanityMints.length,
      suffix: targetSuffix,
      mints: vanityMints,
    };
    fs.writeFileSync("./vanity-mints.json", JSON.stringify(privateData, null, 2));
    
    const publicData = {
      generated: new Date().toISOString(),
      count: vanityMints.length,
      suffix: targetSuffix,
      mints: vanityMints.map(m => m.publicKey),
    };
    fs.writeFileSync("./vanity-mints-public.json", JSON.stringify(publicData, null, 2));
    
    console.log(`Saved: ${vanityMints.length}/10`);
  }
  
  console.log(`\n🎉 All 10 generated!`);
}

main().catch(console.error);
