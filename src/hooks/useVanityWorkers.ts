import { useState, useRef, useCallback, useEffect } from "react";
import { Keypair } from "@solana/web3.js";

interface WorkerMessage {
  type: "ready" | "progress" | "found" | "cancelled";
  iterations?: number;
  publicKey?: string;
  privateKey?: string;
}

/**
 * Hook for parallel vanity keypair generation using Web Workers
 * 
 * Automatically spawns workers equal to CPU core count for parallel search.
 * Much faster than single-threaded, especially on mobile devices.
 */
export function useVanityWorkers() {
  const [isSearching, setIsSearching] = useState(false);
  const [iterations, setIterations] = useState(0);
  const [workerCount, setWorkerCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const workersRef = useRef<Worker[]>([]);
  const resolvedRef = useRef(false);
  const readyCountRef = useRef(0);
  
  // Get optimal worker count based on device
  const getWorkerCount = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
      return Math.min(navigator.hardwareConcurrency, 8);
    }
    return 4;
  }, []);
  
  // Start parallel search
  const startSearch = useCallback((
    onProgress: (iterations: number) => void,
    onFound: (keypair: Keypair) => void
  ) => {
    if (isSearching) return;
    
    resolvedRef.current = false;
    readyCountRef.current = 0;
    setIsSearching(true);
    setIsReady(false);
    setIterations(0);
    
    const count = getWorkerCount();
    setWorkerCount(count);
    
    // Create workers from public URL
    const workers: Worker[] = [];
    for (let i = 0; i < count; i++) {
      const worker = new Worker("/vanity-worker.js");
      workers.push(worker);
    }
    workersRef.current = workers;
    
    let totalIterations = 0;
    let found = false;
    
    // Handle messages from workers
    workers.forEach((worker) => {
      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const msg = event.data;
        
        if (msg.type === "ready") {
          readyCountRef.current++;
          if (readyCountRef.current === count) {
            setIsReady(true);
            // Start searching once all workers are ready
            workers.forEach(w => w.postMessage({ type: "start" }));
          }
        }
        else if (msg.type === "progress" && msg.iterations) {
          totalIterations += msg.iterations;
          setIterations(totalIterations);
          onProgress(totalIterations);
        } 
        else if (msg.type === "found" && msg.publicKey && msg.privateKey && !found && !resolvedRef.current) {
          found = true;
          resolvedRef.current = true;
          
          // Cancel all other workers
          workers.forEach(w => w.postMessage({ type: "cancel" }));
          
          // Reconstruct keypair
          const secretKey = JSON.parse(msg.privateKey!);
          const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
          
          onFound(keypair);
          setIsSearching(false);
        }
        else if (msg.type === "cancelled") {
          // Check if all cancelled
          if (!found && !resolvedRef.current) {
            setIsSearching(false);
          }
        }
      };
      
      worker.onerror = (error) => {
        console.error("Worker error:", error);
      };
      
      // Initialize worker
      worker.postMessage({ type: "init" });
    });
  }, [isSearching, getWorkerCount]);
  
  // Stop all workers
  const stopSearch = useCallback(() => {
    resolvedRef.current = true;
    workersRef.current.forEach(worker => {
      worker.postMessage({ type: "cancel" });
    });
    setIsSearching(false);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      workersRef.current.forEach(worker => worker.terminate());
    };
  }, []);
  
  return {
    isSearching,
    iterations,
    workerCount,
    isReady,
    startSearch,
    stopSearch
  };
}
