import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import {
  TxVersion,
  LAUNCHPAD_PROGRAM,
  getPdaLaunchpadConfigId,
  CpmmCreatorFeeOn,
} from "@raydium-io/raydium-sdk-v2";
import { NATIVE_MINT } from "@solana/spl-token";
import BN from "bn.js";

const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com";

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  description?: string;
  uri?: string; // Metadata URI (Arweave/IPFS)
  supply: number;
  decimals: number;
  totalSellA?: number; // Tokens on bonding curve
  totalFundRaisingB?: number; // SOL to raise (default ~85 SOL)
  creatorFeeOn?: CpmmCreatorFeeOn;
}

export interface TokenLaunchResult {
  success: boolean;
  tokenMint?: string;
  poolId?: string;
  signature?: string;
  error?: string;
}

/**
 * Initialize Raydium SDK client
 */
export async function initRaydium(connection: Connection, owner: Keypair) {
  const { Raydium } = await import("@raydium-io/raydium-sdk-v2");
  
  const raydium = await Raydium.load({
    connection,
    owner,
  });
  
  return raydium;
}

/**
 * Get LaunchPad config ID for SOL-quoted pool
 */
export function getLaunchpadConfigId(): PublicKey {
  return getPdaLaunchpadConfigId(
    LAUNCHPAD_PROGRAM,
    NATIVE_MINT,
    0, // constant product
    0
  ).publicKey;
}

/**
 * Create a token with LaunchLab bonding curve
 * This creates the mint keypair - wallet must sign to create
 */
export async function createLaunchpadToken(
  connection: Connection,
  owner: Keypair,
  params: TokenLaunchParams
): Promise<TokenLaunchResult> {
  try {
    const { Raydium } = await import("@raydium-io/raydium-sdk-v2");
    
    const raydium = await Raydium.load({
      connection,
      owner,
    });

    // Generate new mint keypair (random)
    const mintKeypair = Keypair.generate();

    // Get config ID
    const configId = getLaunchpadConfigId();

    // Default values
    const supply = params.supply * Math.pow(10, params.decimals);
    const totalSellA = params.totalSellA 
      ? params.totalSellA * Math.pow(10, params.decimals)
      : Math.floor(supply * 0.8); // 80% on curve
    const totalFundRaisingB = params.totalFundRaisingB || 85 * 1e9; // 85 SOL

    const { execute, extInfo } = await raydium.launchpad.createLaunchpad({
      programId: LAUNCHPAD_PROGRAM,

      // Token config
      mintA: mintKeypair.publicKey,
      decimals: params.decimals,
      name: params.name,
      symbol: params.symbol,
      uri: params.uri || "",

      // Config
      configId,
      platformId: undefined, // Use Raydium official platform

      // Migration
      migrateType: "cpmm",

      // Bonding curve
      supply: new BN(supply.toString()),
      totalSellA: new BN(totalSellA.toString()),
      totalFundRaisingB: new BN(totalFundRaisingB.toString()),

      // Vesting (optional)
      totalLockedAmount: new BN(0),
      cliffPeriod: new BN(0),
      unlockPeriod: new BN(0),

      // Initial buy (optional - can add initial buy to discourage snipers)
      createOnly: true,
      buyAmount: new BN(0),
      // @ts-ignore - slippage type
      slippage: { numerator: new BN(100), denominator: new BN(10000) },

      // Creator fees
      creatorFeeOn: params.creatorFeeOn || CpmmCreatorFeeOn.OnlyTokenB,

      // Tx settings
      txVersion: TxVersion.V0,
      extraSigners: [mintKeypair],
    });

    const { txIds } = await execute({ sendAndConfirm: true, sequentially: true });

    return {
      success: true,
      tokenMint: mintKeypair.publicKey.toBase58(),
      poolId: extInfo.address.poolId.toBase58(),
      signature: txIds[0],
    };
  } catch (error) {
    console.error("Launchpad creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Simplified version for client-side (returns transaction to sign)
 */
export async function createLaunchpadTransaction(
  connection: Connection,
  owner: PublicKey,
  params: TokenLaunchParams
) {
  const { Raydium } = await import("@raydium-io/raydium-sdk-v2");
  
  // For client-side, we'd need to return the transaction objects
  // This is a simplified placeholder - full implementation needs
  // wallet adapter's signAllTransactions
  
  return {
    message: "Use wallet adapter to sign transactions",
    params,
  };
}
