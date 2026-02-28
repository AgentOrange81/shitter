import { Worker, isMainThread, parentPort } from "worker_threads";
import fs from "fs";
import os from "os";

// Vanity search worker code
const workerCode = `
const { parentPort } = require('worker_threads');
const { Keypair } = require('@solana/web3.js');

const targetSuffix = 'shit';
const targetBytes = Buffer.from(targetSuffix);
const targetLength = targetBytes.length;

parentPort?.on('message', () => {
  let iterations = 0;
  const maxIterations = 50000000; // 50M per worker batch
  
  for (let i = 0; i < maxIterations; i++) {
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
    
    if (match) {
      parentPort?.postMessage({
        found: true,
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Array.from(keypair.secretKey),
        iterations: i + 1
      });
      return;
    }
    
    iterations++;
    
    if (iterations % 1000000 === 0) {
      parentPort?.postMessage({ progress: iterations });
    }
  }
  
  parentPort?.postMessage({ found: false, iterations: maxIterations });
});
`;

async function grindWithWorkers(numWorkers: number): Promise<{ publicKey: string; privateKey: number[] } | null> {
  return new Promise((resolve) => {
    const workers: Worker[] = [];
    let found = false;
    let totalIterations = 0;
    let resolved = false;

    // Create worker files
    const workerFile = './vanity-worker.js';
    fs.writeFileSync(workerFile, workerCode);

    const startTime = Date.now();

    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerFile);
      workers.push(worker);

      worker.on('message', (msg) => {
        if (resolved) return;

        if (msg.found) {
          found = true;
          resolved = true;
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          console.log(`\n✅ FOUND after ${(totalIterations + msg.iterations).toLocaleString()} iterations (${elapsed}s)`);
          console.log(`Mint: ${msg.publicKey}`);
          
          // Kill all workers
          workers.forEach(w => w.terminate());
          
          resolve({
            publicKey: msg.publicKey,
            privateKey: msg.privateKey
          });
        } else if (msg.progress) {
          totalIterations += msg.progress;
          if (totalIterations % 5000000 === 0) {
            console.log(`Total: ${totalIterations.toLocaleString()} iterations`);
          }
        }
      });

      worker.on('error', (err) => {
        console.error('Worker error:', err);
      });

      // Start the worker
      worker.postMessage(true);
    }

    // Cleanup worker file when done
    setTimeout(() => {
      try { fs.unlinkSync(workerFile); } catch {}
    }, 1000);
  });
}

async function main() {
  const numWorkers = Math.min(os.cpus().length, 16);
  const targetCount = 10;
  
  console.log(`=== GPU-Accelerated Vanity Grinder ===`);
  console.log(`Target suffix: "shit"`);
  console.log(`Workers: ${numWorkers} (using all CPU cores)`);
  console.log(`Target: ${targetCount} vanity mints\n`);

  const vanityMints: Array<{ publicKey: string; privateKey: string }> = [];

  for (let i = 0; i < targetCount; i++) {
    console.log(`\n--- Generating #${i + 1}/${targetCount} ---`);
    
    const result = await grindWithWorkers(numWorkers);
    
    if (result) {
      vanityMints.push({
        publicKey: result.publicKey,
        privateKey: Buffer.from(result.privateKey).toString("base64")
      });
      console.log(`Total found: ${vanityMints.length}/${targetCount}`);
    } else {
      console.log(`Not found, retrying...`);
      i--;
    }
  }

  // Save results
  const privateData = {
    generated: new Date().toISOString(),
    count: vanityMints.length,
    suffix: "shit",
    mints: vanityMints,
  };
  
  fs.writeFileSync("./vanity-mints.json", JSON.stringify(privateData, null, 2));
  console.log(`\n✅ Saved ${vanityMints.length} mints to vanity-mints.json`);

  const publicData = {
    generated: new Date().toISOString(),
    count: vanityMints.length,
    suffix: "shit",
    mints: vanityMints.map(m => m.publicKey),
  };
  
  fs.writeFileSync("./vanity-mints-public.json", JSON.stringify(publicData, null, 2));
  console.log(`✅ Public keys saved to vanity-mints-public.json`);
}

main().catch(console.error);
