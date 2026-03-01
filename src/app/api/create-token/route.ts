import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { TxVersion, LAUNCHPAD_PROGRAM, getPdaLaunchpadConfigId, CpmmCreatorFeeOn } from "@raydium-io/raydium-sdk-v2";
import { NATIVE_MINT } from "@solana/spl-token";
import BN from "bn.js";

// Helper to create Percent (simplified)
function createPercent(numerator: number, denominator: number) {
  return {
    numerator: new BN(numerator),
    denominator: new BN(denominator),
    toSignificant: () => (numerator / denominator).toString(),
    toFixed: () => (numerator / denominator).toFixed(2),
  };
}

const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      symbol, 
      description, 
      supply, 
      decimals = 6,
      initialSol = 85,
      curvePercent = 80,
      walletAddress,
      mintPublicKey,
      metadataUri = null,
    } = body;

    if (!name || !symbol || !supply || !walletAddress || !mintPublicKey) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const connection = new Connection(SOLANA_RPC);
    const owner = new PublicKey(walletAddress);
    const mintPubkey = new PublicKey(mintPublicKey);

    // Get config ID
    const configId = getPdaLaunchpadConfigId(
      LAUNCHPAD_PROGRAM,
      NATIVE_MINT,
      0,
      0
    ).publicKey;

    // Calculate curve params (use native BigInt)
    const supplyNum = Number(supply) * Math.pow(10, decimals);
    const totalSellA = Math.floor(supplyNum * curvePercent / 100);
    const totalFundRaisingB = initialSol * 1e9;

    // Convert to BN
    const supplyBN = new BN(supplyNum.toString());
    const totalSellABN = new BN(totalSellA.toString());
    const totalFundRaisingBN = new BN(totalFundRaisingB.toString());

    // Load Raydium SDK
    const { Raydium } = await import("@raydium-io/raydium-sdk-v2");
    
    // Create a temporary keypair for SDK initialization only
    const tempOwner = Keypair.generate();
    const raydium = await Raydium.load({
      connection,
      owner: tempOwner,
    });

    // Build the transaction
    const result = await raydium.launchpad.createLaunchpad({
      programId: LAUNCHPAD_PROGRAM,
      mintA: mintPubkey,
      decimals,
      name,
      symbol,
      uri: metadataUri || "https://arweave.net/placeholder",
      configId,
      migrateType: "cpmm",
      supply: supplyBN,
      totalSellA: totalSellABN,
      totalFundRaisingB: totalFundRaisingBN,
      totalLockedAmount: new BN(0),
      cliffPeriod: new BN(0),
      unlockPeriod: new BN(0),
      createOnly: true,
      buyAmount: new BN(0),
      // @ts-ignore - slippage type mismatch
      slippage: createPercent(100, 10000),
      creatorFeeOn: CpmmCreatorFeeOn.OnlyTokenB,
      txVersion: TxVersion.V0,
      // Don't include extraSigners - client will sign with their mint keypair
    });

    // Get the transaction
    const transactions = result.transactions as any;
    const transaction = transactions[0];
    
    // Get signers info
    const signers = result.signers as any;
    const instructionTypes = result.instructionTypes as any;
    
    // Serialize to base64
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    const base64Tx = Buffer.from(serializedTx).toString("base64");

    // Get pool ID from extInfo
    const extInfo = result.extInfo as any;
    const poolId = extInfo.address.poolId.toBase58();

    return NextResponse.json({
      success: true,
      transaction: base64Tx,
      mint: mintPublicKey,
      poolId,
      message: "Transaction prepared. Sign with your wallet and mint keypair.",
      instructions: [
        "1. Sign the transaction with your wallet",
        "2. Sign with your mint keypair (private key)",
        "3. Submit to network"
      ],
    });

  } catch (error) {
    console.error("Token creation error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create token" },
      { status: 500 }
    );
  }
}
