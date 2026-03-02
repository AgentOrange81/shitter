"use client";

import Link from "next/link";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair } from "@solana/web3.js";
import { useVanityWorkers } from "@/hooks/useVanityWorkers";
import { generateRandomKeypair } from "@/lib/vanity";
import { getUserFriendlyError, withRetry, TokenValidationError } from "@/lib/errors";
import { ErrorDisplay, LoadingSpinner } from "@/components/ErrorBoundary";

export default function CreateToken() {
  const { publicKey, connected } = useWallet();
  const { isSearching, iterations, workerCount, startSearch, stopSearch } = useVanityWorkers();
  
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
  });
  const [curveSettings, setCurveSettings] = useState({
    initialSol: "69",
    curvePercent: "100",
    supply: "420000000",
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
        setStatus(`Searching with ${workerCount} workers...`);
        
        // Use Web Workers for parallel generation
        mintKeypair = await new Promise<Keypair>((resolve, reject) => {
          startSearch(
            (iter) => {
              setStatus(`Searching... ${(iter / 1000).toFixed(0)}k attempts (${workerCount} workers)`);
            },
            (keypair) => {
              setGeneratedMint(keypair);
              setStatus(`Found! Mint: ${keypair.publicKey.toBase58().slice(0, 8)}...shit`);
              resolve(keypair);
            }
          );
        });
        
        if (!mintKeypair) {
          setStatus("Vanity generation cancelled");
          setIsLoading(false);
          return;
        }
      } else {
        mintKeypair = generateRandomKeypair();
        setStatus(`Mint: ${mintKeypair.publicKey.toBase58().slice(0, 8)}...`);
      }
      
      setStatus("Building transaction...");

      // Step 2: Send to server with retry
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
            walletAddress: publicKey.toString(),
            mintPublicKey: mintKeypair.publicKey.toBase58(),
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

      setStatus("Sign transaction in wallet...");
      setStatus("Token prepared! Mint: " + result.mint + " | Pool: " + result.poolId);
      setCreatedToken(result.mint);

    } catch (err) {
      console.error("Token creation error:", err);
      setError(getUserFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-shit-darker text-cream px-4 md:px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold text-gold flex items-center gap-2">
            <span className="text-2xl md:text-3xl">💩</span> SHITTER
          </Link>
          <Link
            href="/"
            className="text-shit-light hover:text-gold transition-colors text-sm md:text-base"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-8 md:py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-shit-light p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-shit-darker mb-2">
            Create Your Token v2
          </h1>
          <p className="text-shit-medium mb-6">
            Launch on Raydium with automatic liquidity migration
          </p>

          {!connected ? (
            <div className="bg-shit-light p-6 rounded-xl text-center">
              <p className="text-shit-darker mb-4 font-semibold">
                Connect your wallet to create a token
              </p>
              <WalletMultiButton className="!bg-gold !text-shit-darker !font-semibold hover:!bg-gold-light transition-colors !mx-auto" />
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
                <div className={`p-4 rounded-lg ${createdToken ? "bg-green-100 text-green-800" : "bg-shit-light text-shit-darker"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex-1">{status}</span>
                    {isSearching && (
                      <button
                        type="button"
                        onClick={stopSearch}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                      >
                        Stop
                      </button>
                    )}
                  </div>
                  {generatedMint && (
                    <div className="mt-2 font-mono text-sm break-all">
                      {generatedMint.publicKey.toBase58()}
                    </div>
                  )}
                  {createdToken && (
                    <div className="mt-2 font-mono text-sm break-all">
                      {createdToken}
                    </div>
                  )}
                </div>
              )}

              {/* Token Image */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Token Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-shit-light rounded-xl flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Token preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🖼️</span>
                    )}
                  </div>
                  <label className="cursor-pointer bg-shit-light hover:bg-shit-medium text-shit-darker px-4 py-2 rounded-lg transition-colors text-sm">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-shit-medium mt-1">
                  Recommended 512x512, PNG or JPG
                </p>
              </div>

              {/* Token Name */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Token Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shitcoin"
                  maxLength={32}
                  className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Token Symbol */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Token Symbol * (max 10 chars)
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase().slice(0, 10) })}
                  placeholder="e.g. SHIT"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors uppercase"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is your token about?"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Mint Type */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Token Address
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setMintType("random")}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mintType === "random" 
                        ? "bg-gold text-shit-darker" 
                        : "bg-shit-light text-shit-darker hover:bg-shit-medium"
                    }`}
                  >
                    🎲 Random
                  </button>
                  <button
                    type="button"
                    onClick={() => setMintType("vanity")}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mintType === "vanity" 
                        ? "bg-gold text-shit-darker" 
                        : "bg-shit-light text-shit-darker hover:bg-shit-medium"
                    }`}
                  >
                    💩 Vanity (shit)
                  </button>
                </div>
                {mintType === "vanity" && (
                  <div className="bg-shit-light p-2 rounded">
                    <p className="text-xs text-shit-medium">
                      <strong>Parallel Workers:</strong> Using {workerCount || "detecting..."} workers for faster search
                    </p>
                    <p className="text-xs text-shit-medium mt-1">
                      Token address will end in "shit" (~1.7M attempts average)
                    </p>
                  </div>
                )}
              </div>

              {/* Curve Settings - Collapsible Advanced */}
              <div className="bg-shit-light rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="w-full p-4 flex items-center justify-between font-semibold text-shit-darker hover:bg-shit-medium transition-colors"
                >
                  <span>⚙️ Advanced Settings</span>
                  <span className={`transform transition-transform ${advancedOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {advancedOpen && (
                  <div className="p-4 pt-0 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-shit-darker mb-1">
                        Total Supply * (min 10,000,000)
                      </label>
                      <input
                        type="text"
                        value={curveSettings.supply}
                        onChange={(e) => setCurveSettings({ ...curveSettings, supply: e.target.value.replace(/[^0-9]/g, "") })}
                        placeholder="e.g. 1000000000"
                        className="w-full px-4 py-2 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none"
                      />
                      <p className="text-xs text-shit-medium mt-1">
                        Tokens will be created with 9 decimals
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-shit-darker mb-1">
                        SOL to Raise (Migration Threshold)
                      </label>
                      <input
                        type="number"
                        value={curveSettings.initialSol}
                        onChange={(e) => setCurveSettings({ ...curveSettings, initialSol: e.target.value })}
                        min="30"
                        max="200"
                        className="w-full px-4 py-2 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none"
                      />
                      <p className="text-xs text-shit-medium mt-1">
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
                        className="w-full px-4 py-2 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none"
                      />
                      <p className="text-xs text-shit-medium mt-1">
                        Remaining tokens go to creator after migration (min 20%)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Socials */}
              <div className="space-y-3">
                <h3 className="font-semibold text-shit-darker">Social Links (optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={socials.twitter}
                    onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                    placeholder="Twitter handle"
                    className="px-4 py-2 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={socials.telegram}
                    onChange={(e) => setSocials({ ...socials, telegram: e.target.value })}
                    placeholder="Telegram group"
                    className="px-4 py-2 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none text-sm"
                  />
                  <input
                    type="url"
                    value={socials.website}
                    onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                    placeholder="Website URL"
                    className="px-4 py-2 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold hover:bg-gold-light text-shit-darker font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
