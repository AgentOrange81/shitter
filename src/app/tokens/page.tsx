"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Token {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  price: string | null;
  priceChange24h: number | null;
  liquidity: number | null;
  marketCap: number | null;
  poolAddress: string | null;
  dex: string | null;
  createdAt: string;
}

function formatPrice(price: string | null): string {
  if (!price) return "--";
  const num = parseFloat(price);
  if (num >= 1) return `$${num.toFixed(2)}`;
  if (num >= 0.01) return `$${num.toFixed(4)}`;
  return `$${num.toFixed(6)}`;
}

function formatMarketCap(mcap: number | null): string {
  if (!mcap) return "--";
  if (mcap >= 1e9) return `$${(mcap / 1e9).toFixed(2)}B`;
  if (mcap >= 1e6) return `$${(mcap / 1e6).toFixed(2)}M`;
  if (mcap >= 1e3) return `$${(mcap / 1e3).toFixed(2)}K`;
  return `$${mcap.toFixed(2)}`;
}

export default function Tokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_VANITY_API || "https://larry.tailfb3d02.ts.net";
    fetch(`${apiUrl}/tokens`)
      .then(res => res.json())
      .then(data => {
        setTokens(data.tokens || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tokens:", err);
        setError("Failed to load tokens. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-shit-darker text-cream px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gold">
            SHITTER
          </Link>
          <div className="flex gap-3 items-center text-sm">
            <Link href="/create" className="bg-gold text-shit-darker px-3 py-1.5 rounded-lg font-semibold hover:bg-gold-light transition-colors">
              Launch
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-shit text-cream py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Live <span className="text-gold relative">
              Tokens
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gold/50 rounded-full"></span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-shit-light">
            The shittiest tokens on Solana
          </p>
        </div>
      </section>

      <section id="tokens" className="py-12 md:py-20 px-4 bg-gradient-cream">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8 max-w-md mx-auto">
              <p className="text-red-800 text-center">{error}</p>
            </div>
          )}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-shit-medium">Loading tokens...</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-shit-medium">No tokens yet. Be the first to launch! 🚀</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <div
                  key={token.mint}
                  className="bg-white rounded-3xl shadow-lifted border-2 border-shit-light overflow-hidden hover:border-shit-brown hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="text-5xl group-hover:scale-110 transition-transform">💩</div>
                      <div>
                        <h3 className="text-xl font-bold text-shit-darker group-hover:text-shit-brown transition-colors">
                          {token.name}
                        </h3>
                        <span className="text-shit-medium font-mono text-sm">
                          {token.symbol}
                        </span>
                      </div>
                    </div>
                    <p className="text-shit-medium text-sm mb-6 line-clamp-2">
                      {token.description || "No description"}
                    </p>
                    <div className="flex justify-between items-center pt-5 border-t border-shit-light">
                      <div>
                        <span className="text-shit-medium text-xs block">Price</span>
                        <p className="font-bold text-shit-darker">{formatPrice(token.price)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-shit-medium text-xs block">24h</span>
                        <p
                          className={`font-bold ${
                            token.priceChange24h && token.priceChange24h >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {token.priceChange24h !== null 
                            ? `${token.priceChange24h >= 0 ? '+' : ''}${token.priceChange24h.toFixed(1)}%` 
                            : '--'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-shit-medium text-xs block">MCap</span>
                        <p className="font-bold text-shit-darker">
                          {formatMarketCap(token.marketCap)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-shit-light">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-shit-darker mb-5">
            Launch Your Token
          </h2>
          <p className="text-lg text-shit-medium mb-10 max-w-md mx-auto">
            Be the next big meme coin on Solana
          </p>
          <Link
            href="/create"
            className="inline-block bg-gold text-shit-darker px-10 py-5 rounded-2xl text-xl font-bold hover:bg-gold-light hover:scale-105 transition-all shadow-lifted"
          >
            Create Token 🚀
          </Link>
        </div>
      </section>

      <footer className="bg-shit-darker text-shit-light py-10 md:py-12 px-4 md:px-6 border-t border-shit-dark/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gold font-bold text-xl flex items-center gap-2">
            <span className="text-3xl">💩</span> SHITTER
          </div>
          <div className="flex gap-6 md:gap-8">
            <a href="#" className="hover:text-gold transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              Telegram
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              Discord
            </a>
          </div>
          <div className="text-sm text-shit-medium">
            © 2026 Shitter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}