"use client";

import Link from "next/link";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { generateVanityKeypair, generateRandomKeypair, cancelVanitySearch, resetVanitySearch } from "@/lib/vanity";

export default function CreateToken() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    supply: "",
  });
  const [curveSettings, setCurveSettings] = useState({
    initialSol: "85", // SOL to raise before migration
    curvePercent: "80", // % of supply on bonding curve
  });
  const [mintType, setMintType] = useState<"random" | "vanity">("random");
  const [socials, setSocials] = useState({
    twitter: "",
    telegram: "",
    website: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingVanity, setIsSearchingVanity] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [createdToken, setCreatedToken] = useState<string | null>(null);

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
      setStatus("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);
    setCreatedToken(null);

    try {
      // Step 1: Generate mint keypair in browser
      let mintKeypair;
      
      if (mintType === "vanity") {
        setIsSearchingVanity(true);
        setStatus("Generating vanity address... (this may take a while)");
        resetVanitySearch();
        
        mintKeypair = await generateVanityKeypair((iterations) => {
          setStatus(`Searching... ${(iterations / 1000).toFixed(0)}k attempts`);
        });
        
        setIsSearchingVanity(false);
        
        if (!mintKeypair) {
          setStatus("Vanity generation cancelled");
          setIsLoading(false);
          return;
        }
        
        setStatus(`Found! Mint: ${mintKeypair.publicKey.toBase58().slice(0, 8)}...shit`);
      } else {
        mintKeypair = generateRandomKeypair();
        setStatus(`Mint: ${mintKeypair.publicKey.toBase58().slice(0, 8)}...`);
      }
      
      setStatus("Building transaction...");

      // Step 2: Send to server with mint pubkey
      const response = await fetch("/api/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          supply: formData.supply,
          initialSol: parseInt(curveSettings.initialSol),
          curvePercent: parseInt(curveSettings.curvePercent),
          walletAddress: publicKey.toString(),
          mintPublicKey: mintKeypair.publicKey.toBase58(),
          socials,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setStatus("Error: " + (result.error || "Unknown error"));
        setIsLoading(false);
        return;
      }

      setStatus("Sign transaction in wallet...");

      // Step 3: Parse transaction
      const { Transaction } = await import("@solana/web3.js");
      const transaction = Transaction.from(Buffer.from(result.transaction, "base64"));

      // Step 4: Get connection and send transaction
      // Note: In real implementation, you'd use wallet-adapter's sendTransaction
      // with the mint keypair as an additional signer
      
      // For now, show the result
      setStatus("Token prepared! Mint: " + result.mint + " | Pool: " + result.poolId);
      setCreatedToken(result.mint);

    } catch (error) {
      console.error("Token creation error:", error);
      setStatus("Failed: " + (error instanceof Error ? error.message : "Unknown error"));
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
            Create Your Token
          </h1>
          <p className="text-shit-medium mb-6">
            Launch on Raydium with automatic liquidity migration
          </p>

          {!connected ? (
            <div className="bg-shit-light p-6 rounded-xl text-center">
              <p className="text-shit-darker mb-4 font-semibold">
                Connect your wallet to create a token
              </p>
              <WalletMultiButton className="!bg-gold !text-shit-darker !font-sem-lg hover:!ibold !roundedbg-gold-light transition-colors !mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Status */}
              {status && (
                <div className={`p-4 rounded-lg ${createdToken ? "bg-green-100 text-green-800" : "bg-shit-light text-shit-darker"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex-1">{status}</span>
                    {isSearchingVanity && (
                      <button
                        type="button"
                        onClick={() => cancelVanitySearch()}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                      >
                        Stop
                      </button>
                    )}
                  </div>
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

              {/* Supply */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Total Supply * (min 10,000,000)
                </label>
                <input
                  type="text"
                  value={formData.supply}
                  onChange={(e) => setFormData({ ...formData, supply: e.target.value.replace(/[^0-9]/g, "") })}
                  placeholder="e.g. 1000000000"
                  className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors"
                  required
                />
                <p className="text-xs text-shit-medium mt-1">
                  Tokens will be created with 9 decimals
                </p>
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
                  <p className="text-xs text-shit-medium bg-shit-light p-2 rounded">
                    Token address will end in "shit" (may take longer to create)
                  </p>
                )}
              </div>

              {/* Curve Settings */}
              <div className="bg-shit-light rounded-xl p-4 space-y-4">
                <h3 className="font-semibold text-shit-darker">Bonding Curve Settings</h3>
                
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
