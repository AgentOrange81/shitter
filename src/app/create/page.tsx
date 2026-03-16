"use client";

import Link from "next/link";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { generateRandomKeypair } from "@/lib/keypair";
import { getUserFriendlyError, withRetry, NetworkError } from "@/lib/errors";
import { ErrorDisplay, LoadingSpinner } from "@/components/ErrorBoundary";

export default function CreateToken() {
  const { publicKey, connected, signTransaction } = useWallet();
  
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
  });
  const [curveSettings, setCurveSettings] = useState({
    initialSol: "69",
    curvePercent: "100",
    supply: "420000000",
    initialBuy: "0",
  });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [mintType, setMintType] = useState<"random" | "vanity">("random");
  const [socials, setSocials] = useState({
    twitter: "",
    telegram: "",
    website: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [generatedMint, setGeneratedMint] = useState<Keypair | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError("Please connect your wallet first!");
      return;
    }

    // Validate form
    if (!formData.name || formData.name.length < 2) {
      setError("Token name must be at least 2 characters.");
      return;
    }
    if (!formData.symbol || formData.symbol.length < 1) {
      setError("Token symbol is required.");
      return;
    }
    if (parseInt(curveSettings.supply) < 10000000) {
      setError("Minimum supply is 10,000,000 tokens.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setCreatedToken(null);
    setGeneratedMint(null);

    try {
      // Step 1: Generate mint keypair
      let mintKeypair: Keypair;
      
      if (mintType === "vanity") {
        // Use remote GPU-powered vanity API
        const apiUrl = process.env.NEXT_PUBLIC_VANITY_API;
        if (!apiUrl) {
          throw new NetworkError("Vanity API not configured. Check environment variables.");
        }
        setStatus("Generating vanity address on GPU server...");
        
        const response = await fetch(`${apiUrl}/generate-vanity`, {
          method: "POST",
        });
        
        if (!response.ok) {
          throw new NetworkError("Failed to generate vanity address. Please try again.");
        }
        
        const { publicKey: pubkey, privateKey: privkey } = await response.json();
        
        // Reconstruct keypair from base58
        const privateKeyBytes = bs58.decode(privkey);
        mintKeypair = Keypair.fromSecretKey(new Uint8Array(privateKeyBytes));
        
        setGeneratedMint(mintKeypair);
        setStatus(`Found! Mint: ${mintKeypair.publicKey.toBase58().slice(0, 8)}... ready!`);
      } else {
        mintKeypair = generateRandomKeypair();
        setStatus(`Mint: ${mintKeypair.publicKey.toBase58().slice(0, 8)}...`);
      }
      
      // Step 2: Upload metadata to IPFS (if image provided)
      let metadataUri = "https://arweave.net/placeholder";
      
      if (image || socials.twitter || socials.telegram || socials.website) {
        setStatus("Uploading metadata to IPFS...");
        
        const metadataFormData = new FormData();
        metadataFormData.append("name", formData.name);
        metadataFormData.append("symbol", formData.symbol);
        metadataFormData.append("description", formData.description);
        metadataFormData.append("twitter", socials.twitter);
        metadataFormData.append("telegram", socials.telegram);
        metadataFormData.append("website", socials.website);
        if (image) {
          metadataFormData.append("image", image);
        }
        
        const metadataResponse = await fetch("/api/upload-metadata", {
          method: "POST",
          body: metadataFormData,
        });
        
        const metadataResult = await metadataResponse.json();
        if (metadataResult.success && metadataResult.metadataUri) {
          metadataUri = metadataResult.metadataUri;
        }
      }
      
      setStatus("Building transaction...");

      // Step 3: Send to server with retry
      const response = await withRetry(
        () => fetch("/api/create-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            symbol: formData.symbol,
            description: formData.description,
            supply: curveSettings.supply,
            initialSol: parseInt(curveSettings.initialSol),
            curvePercent: parseInt(curveSettings.curvePercent),
            initialBuy: parseFloat(curveSettings.initialBuy) || 0,
            walletAddress: publicKey.toString(),
            mintPublicKey: mintKeypair.publicKey.toBase58(),
            metadataUri,
            socials,
          }),
        }),
        {
          maxRetries: 2,
          onRetry: (attempt) => setStatus(`Retrying... (attempt ${attempt})`)
        }
      );

      const result = await response.json();

      if (!result.success) {
        setStatus("Error: " + (result.error || "Unknown error"));
        setIsLoading(false);
        return;
      }

      if (!signTransaction) {
        throw new Error("Wallet doesn't support transaction signing");
      }

      setStatus("Please sign in wallet...");
      
      // Step 3: Sign with mint keypair and submit
      const { Connection, Transaction } = await import("@solana/web3.js");
      const RPC_URL = "https://api.mainnet-beta.solana.com";
      const connection = new Connection(RPC_URL);

      // Deserialize the transaction
      const transactionBuffer = Buffer.from(result.transaction, "base64");
      const transaction = Transaction.from(transactionBuffer);

      // First, let user sign with their wallet
      const walletSignedTx = await signTransaction(transaction);

      // Then sign with the mint keypair (this is the critical step!)
      walletSignedTx.partialSign(mintKeypair);

      // Serialize and submit
      const signedTx = walletSignedTx.serialize();
      const signature = await connection.sendRawTransaction(signedTx, {
        skipPreflight: false,
        maxRetries: 3,
      });

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");

      setStatus("Token launched! Mint: " + result.mint + " | Pool: " + result.poolId);
      setCreatedToken(result.mint);

    } catch (err) {
      console.error("Token creation error:", err);
      setError(getUserFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cream">
      {/* Navigation */}
      <nav className="bg-shit-darker/95 backdrop-blur-md text-cream px-4 md:px-6 py-3 sticky top-0 z-50 border-b border-shit-dark/50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold text-gold flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl group-hover:animate-bounce inline-block">💩</span> 
            <span className="hidden sm:inline">SHITTER</span>
          </Link>
          <Link
            href="/"
            className="text-shit-light hover:text-gold transition-colors text-sm md:text-base font-medium"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-10 md:py-16 px-4">
        <div className="bg-white rounded-3xl shadow-lifted border-2 border-shit-light p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-shit-darker mb-3">
            Create Your Token <span className="text-shit-brown">v2</span>
          </h1>
          <p className="text-shit-medium mb-8 text-lg">
            Launch on Raydium with automatic liquidity migration
          </p>

          {!connected ? (
            <div className="bg-shit-light/50 p-8 rounded-2xl text-center border-2 border-shit-light">
              <p className="text-shit-darker mb-6 font-semibold text-lg">
                Connect your wallet to create a token
              </p>
              <WalletMultiButton className="!bg-gold !text-shit-darker !font-bold hover:!bg-gold-light transition-colors !mx-auto !px-8 !py-3 !rounded-xl" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Display */}
              {error && (
                <ErrorDisplay 
                  error={error} 
                  onRetry={() => setError(null)} 
                />
              )}

              {/* Status */}
              {status && (
                <div className={`p-5 rounded-xl ${createdToken ? "bg-green-100 border-2 border-green-300 text-green-800" : "bg-shit-light/50 border-2 border-shit-light text-shit-darker"}`}>
                  <div className="flex items-center gap-3">
                    {createdToken ? (
                      <span className="text-2xl">🎉</span>
                    ) : (
                      <span className="animate-spin text-2xl">⏳</span>
                    )}
                    <span className="flex-1 font-medium">{status}</span>
                  </div>
                  {generatedMint && (
                    <div className="mt-3 font-mono text-sm break-all bg-white/50 p-2 rounded">
                      {generatedMint.publicKey.toBase58()}
                    </div>
                  )}
                  {createdToken && (
                    <div className="mt-3 font-mono text-sm break-all bg-white/50 p-2 rounded">
                      {createdToken}
                    </div>
                  )}
                </div>
              )}

              {/* Token Image */}
              <div>
                <label className="block text-sm font-semibold text-shit-darker mb-3">
                  Token Image
                </label>
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 bg-shit-light rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Token preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🖼️</span>
                    )}
                  </div>
                  <label className="cursor-pointer bg-shit-light hover:bg-shit-medium text-shit-darker px-5 py-3 rounded-xl transition-colors font-medium hover:scale-105 transition-transform">
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-shit-medium mt-2">
                  Recommended 512x512, PNG or JPG
                </p>
              </div>

              {/* Token Name */}
              <div>
                <label className="block text-sm font-semibold text-shit-darker mb-2">
                  Token Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shitcoin"
                  maxLength={32}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all hover:border-shit-medium"
                  required
                />
              </div>

              {/* Token Symbol */}
              <div>
                <label className="block text-sm font-semibold text-shit-darker mb-2">
                  Token Symbol * <span className="text-shit-medium text-xs">(max 10 chars)</span>
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase().slice(0, 10) })}
                  placeholder="e.g. SHIT"
                  maxLength={10}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all hover:border-shit-medium uppercase"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-shit-darker mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is your token about?"
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all hover:border-shit-medium resize-none"
                />
              </div>

              {/* Mint Type */}
              <div>
                <label className="block text-sm font-semibold text-shit-darker mb-3">
                  Token Address
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setMintType("random")}
                    className={`py-3 px-4 rounded-xl text-base font-semibold transition-all ${
                      mintType === "random" 
                        ? "bg-gold text-shit-darker shadow-glow" 
                        : "bg-shit-light text-shit-darker hover:bg-shit-medium"
                    }`}
                  >
                    🎲 Random
                  </button>
                  <button
                    type="button"
                    onClick={() => setMintType("vanity")}
                    className={`py-3 px-4 rounded-xl text-base font-semibold transition-all ${
                      mintType === "vanity" 
                        ? "bg-gold text-shit-darker shadow-glow" 
                        : "bg-shit-light text-shit-darker hover:bg-shit-medium"
                    }`}
                  >
                    💩 Vanity
                  </button>
                </div>
                {mintType === "vanity" && (
                  <div className="bg-shit-light/50 p-4 rounded-xl border border-shit-light">
                    <p className="text-sm text-shit-darker flex items-center gap-2">
                      <span>🔍</span> GPU-powered server generation (~10 seconds)
                    </p>
                    <p className="text-sm text-shit-medium mt-2">
                      Token will end in <strong className="text-shit-darker">"shit"</strong> (~1.7M tries avg)
                    </p>
                  </div>
                )}
              </div>

              {/* Curve Settings - Collapsible Advanced */}
              <div className="bg-shit-light/50 rounded-2xl overflow-hidden border-2 border-shit-light">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="w-full p-5 flex items-center justify-between font-semibold text-shit-darker hover:bg-shit-light transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>⚙️</span> Advanced Settings
                  </span>
                  <span className={`transform transition-transform ${advancedOpen ? 'rotate-180' : ''} text-shit-medium`}>
                    ▼
                  </span>
                </button>
                
                {advancedOpen && (
                  <div className="p-5 pt-2 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-shit-darker mb-2">
                        Total Supply * <span className="text-shit-medium text-xs">(min 10,000,000)</span>
                      </label>
                      <input
                        type="text"
                        value={curveSettings.supply}
                        onChange={(e) => setCurveSettings({ ...curveSettings, supply: e.target.value.replace(/[^0-9]/g, "") })}
                        placeholder="e.g. 1000000000"
                        className="w-full px-4 py-3 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all"
                      />
                      <p className="text-xs text-shit-medium mt-2">
                        Tokens will be created with 9 decimals
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-shit-darker mb-2">
                        SOL to Raise <span className="text-shit-medium text-xs">(Migration Threshold)</span>
                      </label>
                      <input
                        type="number"
                        value={curveSettings.initialSol}
                        onChange={(e) => setCurveSettings({ ...curveSettings, initialSol: e.target.value })}
                        min="30"
                        max="200"
                        className="w-full px-4 py-3 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all"
                      />
                      <p className="text-xs text-shit-medium mt-2">
                        Pool migrates to Raydium when this SOL is raised (min 30 SOL)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-shit-darker mb-1">
                        % of Supply on Curve
                      </label>
                      <input
                        type="number"
                        value={curveSettings.curvePercent}
                        onChange={(e) => setCurveSettings({ ...curveSettings, curvePercent: e.target.value })}
                        min="20"
                        max="100"
                        className="w-full px-4 py-3 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all"
                      />
                      <p className="text-xs text-shit-medium mt-2">
                        Remaining tokens go to creator after migration (min 20%)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-shit-darker mb-2">
                        Initial Buy (SOL) <span className="text-shit-medium text-xs">- Buy your own token at launch</span>
                      </label>
                      <input
                        type="number"
                        value={curveSettings.initialBuy}
                        onChange={(e) => setCurveSettings({ ...curveSettings, initialBuy: e.target.value })}
                        min="0"
                        max="50"
                        step="0.1"
                        className="w-full px-4 py-3 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all"
                      />
                      <p className="text-xs text-shit-medium mt-2">
                        Buy your own token immediately after launch (optional)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Socials */}
              <div className="space-y-4">
                <h3 className="font-semibold text-shit-darker text-lg">Social Links <span className="text-shit-medium text-sm font-normal">(optional)</span></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={socials.twitter}
                    onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                    placeholder="Twitter handle"
                    className="px-4 py-3 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all text-sm"
                  />
                  <input
                    type="text"
                    value={socials.telegram}
                    onChange={(e) => setSocials({ ...socials, telegram: e.target.value })}
                    placeholder="Telegram group"
                    className="px-4 py-3 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all text-sm"
                  />
                  <input
                    type="url"
                    value={socials.website}
                    onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                    placeholder="Website URL"
                    className="px-4 py-3 rounded-xl border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold hover:bg-gold-light text-shit-darker font-bold py-5 rounded-2xl text-xl transition-all hover:scale-[1.02] shadow-lifted disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Creating Token..." : "Launch Token 🚀"}
              </button>

              <p className="text-xs text-center text-shit-medium">
                Creating a token requires a small SOL fee. Token will have bonding curve for instant trading.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
