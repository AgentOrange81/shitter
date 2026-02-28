"use client";

import Link from "next/link";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function CreateToken() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    supply: "",
    decimals: "9",
  });
  const [socials, setSocials] = useState({
    twitter: "",
    telegram: "",
    website: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setStatus("Creating token...");
    setCreatedToken(null);

    try {
      // For demo/development - just simulate token creation
      // In production, this would use the full Raydium SDK
      const response = await fetch("/api/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          supply: formData.supply,
          decimals: parseInt(formData.decimals),
          walletAddress: publicKey.toString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("Token created successfully! 🎉");
        setCreatedToken("Demo token address: " + result.config.mintAuthority);
      } else {
        setStatus("Error: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Token creation error:", error);
      setStatus("Failed to create token. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-shit-darker text-cream px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold">
            SHITTER
          </Link>
          <Link
            href="/"
            className="text-shit-light hover:text-gold transition-colors"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-shit-light p-8">
          <h1 className="text-3xl font-bold text-shit-darker mb-2">
            Create Your Token
          </h1>
          <p className="text-shit-medium mb-8">
            Launch on Raydium in seconds
          </p>

          {!connected ? (
            <div className="bg-shit-light p-6 rounded-xl text-center">
              <p className="text-shit-darker mb-4 font-semibold">
                Connect your wallet to create a token
              </p>
              <WalletMultiButton className="!bg-gold !text-shit-darker !font-semibold !rounded-lg hover:!bg-gold-light transition-colors !mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status */}
              {status && (
                <div className={`p-4 rounded-lg ${createdToken ? "bg-green-100 text-green-800" : "bg-shit-light text-shit-darker"}`}>
                  {status}
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
                  <div className="w-24 h-24 bg-shit-light rounded-xl flex items-center justify-center overflow-hidden">
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
                  <label className="cursor-pointer bg-shit-light hover:bg-shit-medium hover:text-white px-4 py-2 rounded-lg transition-colors">
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-shit-medium mt-1">
                  Min 128x128, max 5MB
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
                  className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Token Symbol */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Token Symbol *
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="e.g. SHIT"
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
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Supply */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Total Supply *
                </label>
                <input
                  type="text"
                  value={formData.supply}
                  onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                  placeholder="e.g. 1000000000"
                  className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Decimals */}
              <div>
                <label className="block text-sm font-medium text-shit-darker mb-2">
                  Decimals
                </label>
                <select
                  value={formData.decimals}
                  onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="9">9 (default)</option>
                </select>
              </div>

              {/* Social Links */}
              <div className="border-t border-shit-light pt-6">
                <h3 className="text-lg font-semibold text-shit-darker mb-4">
                  Social Links (Optional)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-shit-darker mb-2">
                      Twitter
                    </label>
                    <input
                      type="text"
                      value={socials.twitter}
                      onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                      placeholder="@username"
                      className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-shit-darker mb-2">
                      Telegram
                    </label>
                    <input
                      type="text"
                      value={socials.telegram}
                      onChange={(e) => setSocials({ ...socials, telegram: e.target.value })}
                      placeholder="@username"
                      className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-shit-darker mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={socials.website}
                      onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 rounded-lg border-2 border-shit-light focus:border-shit-brown focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold text-shit-darker py-4 rounded-xl text-lg font-bold hover:bg-gold-light transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </span>
                ) : (
                  "Launch Token"
                )}
              </button>

              <p className="text-center text-sm text-shit-medium">
                By creating a token, you agree to the terms of service
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
