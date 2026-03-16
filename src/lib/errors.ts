/**
 * Error handling utilities for Shitter
 */

// Error types
export class WalletNotConnectedError extends Error {
  constructor(message = "Wallet not connected") {
    super(message);
    this.name = "WalletNotConnectedError";
  }
}

export class TransactionExpiredError extends Error {
  constructor(message = "Transaction expired. Please try again.") {
    super(message);
    this.name = "TransactionExpiredError";
  }
}

export class InsufficientBalanceError extends Error {
  constructor(needed: number, available: number) {
    super(`Insufficient SOL. Need ${needed} SOL, have ${available} SOL`);
    this.name = "InsufficientBalanceError";
  }
}

export class TokenValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenValidationError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Network error. Please check your connection.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class RateLimitError extends Error {
  constructor(message = "Too many requests. Please wait a moment.") {
    super(message);
    this.name = "RateLimitError";
  }
}

// Error codes from Solana/RPC
const SOLANA_ERROR_CODES: Record<string, string> = {
  "-32002": "Transaction rejected. Please try again.",
  "-32001": "RPC node error. Please try a different endpoint.",
  "-32000": "Invalid request. Please refresh and try again.",
  "-32600": "Invalid parameters. Please check your input.",
  "-32601": "Method not found. Please refresh the page.",
  "-32602": "Invalid params. Please check your input.",
  "-32603": "Internal error. Please try again later.",
};

// Parse Solana RPC errors
export function parseSolanaError(error: unknown): string {
  if (typeof error === "string") {
    // Check for error code in string
    for (const [code, message] of Object.entries(SOLANA_ERROR_CODES)) {
      if (error.includes(code)) {
        return message;
      }
    }
    return error;
  }
  
  if (error instanceof Error) {
    const message = error.message;
    
    // Check for common error patterns
    if (message.includes("Transaction expired") || message.includes("blockhash")) {
      return "Transaction expired. Please try again.";
    }
    if (message.includes("insufficient funds") || message.includes("InsufficientBalance")) {
      return "Insufficient SOL balance. Please add more SOL to your wallet.";
    }
    if (message.includes("User rejected") || message.includes("User rejected")) {
      return "Transaction rejected. Please approve in your wallet.";
    }
    if (message.includes("connection") || message.includes("fetch")) {
      return "Network error. Please check your connection.";
    }
    
    return message;
  }
  
  return "An unexpected error occurred. Please try again.";
}

// User-friendly error messages
export function getUserFriendlyError(error: unknown): string {
  // Check for specific error types
  if (error instanceof WalletNotConnectedError) {
    return "Please connect your wallet to continue.";
  }
  if (error instanceof TransactionExpiredError) {
    return "Transaction timed out. Please try again.";
  }
  if (error instanceof InsufficientBalanceError) {
    return error.message;
  }
  if (error instanceof TokenValidationError) {
    return error.message;
  }
  if (error instanceof NetworkError) {
    return error.message;
  }
  if (error instanceof RateLimitError) {
    return error.message;
  }
  
  // Fall back to Solana error parsing
  return parseSolanaError(error);
}

// Retry helper with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const { 
    maxRetries = 3, 
    initialDelay = 1000,
    onRetry 
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on validation errors
      if (error instanceof TokenValidationError || 
          error instanceof InsufficientBalanceError ||
          error instanceof WalletNotConnectedError) {
        throw error;
      }
      
      // Don't retry on user rejection
      if (lastError.message.includes("rejected") || 
          lastError.message.includes("denied")) {
        throw error;
      }
      
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        onRetry?.(attempt + 1, lastError);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

// Format SOL amount for display
export function formatSOL(lamports: number): string {
  return (lamports / 1e9).toFixed(4);
}
