/**
 * Vanity Keypair Generator - Web Worker (Public)
 * Place in public folder and load via URL
 */

// @ts-nocheck
/* eslint-disable */

let Keypair = null;
let targetBytes = null;
let targetLength = 0;
let cancelled = false;

async function init() {
  const web3 = await import("@solana/web3.js");
  Keypair = web3.Keypair;
  
  const targetSuffix = "shit";
  targetBytes = new TextEncoder().encode(targetSuffix);
  targetLength = targetBytes.length;
}

function checkMatch(pubkeyBytes) {
  const suffix = pubkeyBytes.slice(-targetLength);
  for (let i = 0; i < targetLength; i++) {
    if (suffix[i] !== targetBytes[i]) return false;
  }
  return true;
}

function search() {
  let iterations = 0;
  const reportEvery = 10000;
  
  while (!cancelled) {
    const keypair = Keypair.generate();
    const pubkeyBytes = keypair.publicKey.toBytes();
    
    iterations++;
    
    if (checkMatch(pubkeyBytes)) {
      const secretKey = Array.from(keypair.secretKey);
      const publicKey = keypair.publicKey.toBase58();
      
      self.postMessage({
        type: "found",
        publicKey,
        privateKey: JSON.stringify(secretKey),
        iterations
      });
      return;
    }
    
    if (iterations % reportEvery === 0) {
      self.postMessage({ type: "progress", iterations });
    }
  }
  
  self.postMessage({ type: "cancelled", iterations });
}

self.onmessage = async (event) => {
  const { type, suffix } = event.data;
  
  if (type === "init") {
    await init();
    self.postMessage({ type: "ready" });
  } else if (type === "start") {
    cancelled = false;
    search();
  } else if (type === "cancel") {
    cancelled = true;
  }
};

init().then(() => {
  self.postMessage({ type: "ready" });
});
