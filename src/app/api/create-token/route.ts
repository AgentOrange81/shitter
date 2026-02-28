import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      symbol, 
      description, 
      supply, 
      decimals = 9,
      walletAddress,
    } = body;

    if (!name || !symbol || !supply || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields: name, symbol, supply, walletAddress" },
        { status: 400 }
      );
    }

    const connection = new Connection(SOLANA_RPC);
    
    const tokenConfig = {
      name,
      symbol,
      description: description || "",
      supply: supply.toString(),
      decimals,
      mintAuthority: walletAddress,
      freezeAuthority: null,
      poolConfig: {
        solRaiseTarget: 30,
        supplyOnCurve: 80,
      }
    };

    return NextResponse.json({
      success: true,
      message: "Token configuration validated",
      config: tokenConfig,
      instructions: [
        "1. Create token mint account",
        "2. Initialize token (mint authority)",
        "3. Create associated token account",
        "4. Mint tokens to ATA",
        "5. Create Raydium pool (future)"
      ]
    });

  } catch (error) {
    console.error("Token creation error:", error);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const connection = new Connection(SOLANA_RPC);
  
  const lamports = await connection.getMinimumBalanceForRentExemption(82);
  const estimatedCost = lamports / 1e9;

  return NextResponse.json({
    estimatedCost,
    currency: "SOL",
    network: "mainnet",
    breakdown: {
      mintAccountRent: estimatedCost,
      associatedTokenRent: estimatedCost,
      transactionFee: 0.000005,
    }
  });
}
