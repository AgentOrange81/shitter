"use client";

import { useState } from "react";
import Link from "next/link";
import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-shit-darker text-cream px-4 py-3 md:px-6 md:py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold text-gold flex items-center gap-2">
            <span className="text-2xl md:text-3xl">💩</span> SHITTER
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="hover:text-gold transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-gold transition-colors">
              How It Works
            </Link>
            <Link href="/tokens" className="hover:text-gold transition-colors">
              Tokens
            </Link>
            <ConnectWalletButton />
            <Link
              href="/create"
              className="bg-gold text-shit-darker px-4 py-2 rounded-lg font-semibold hover:bg-gold-light transition-colors"
            >
              Launch Token
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cream p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link 
              href="#features" 
              className="block hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="block hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/tokens" 
              className="block hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tokens
            </Link>
            <div className="pt-2">
              <ConnectWalletButton />
            </div>
            <Link
              href="/create"
              className="block bg-gold text-shit-darker px-4 py-3 rounded-lg font-semibold text-center hover:bg-gold-light transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Launch Token
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-shit-darker text-cream py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl md:text-7xl mb-4 animate-bounce">
            💩
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6">
            Launch Your{" "}
            <span className="text-gold">Meme Coin</span>
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>on Solana
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-shit-light mb-8 md:mb-10 max-w-2xl mx-auto">
            The shittiest launchpad in crypto. Create tokens, launch on Raydium, and
            let the memes flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/create"
              className="bg-gold text-shit-darker px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold hover:bg-gold-light transition-all hover:scale-105"
            >
              Create Token
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-shit-light text-shit-light px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:bg-shit-light hover:text-shit-darker transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20 px-4 md:px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-shit-darker mb-10 md:mb-16">
            Why <span className="text-shit-brown">Shitter</span>?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-shit-light">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-bold text-shit-darker mb-3">Lightning Fast</h4>
              <p className="text-shit-medium">
                Deploy to Raydium in seconds. Our streamlined process gets your token
                live without the hassle.
              </p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-shit-light">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-bold text-shit-darker mb-3">Low Fees</h4>
              <p className="text-shit-medium">
                Built on Solana means minimal gas. Keep more of your gains for
                yourself and your community.
              </p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-shit-light">
              <div className="text-4xl mb-4">💩</div>
              <h4 className="text-xl font-bold text-shit-darker mb-3">Meme Ready</h4>
              <p className="text-shit-medium">
                Upload images, add social links, and customize your token page.
                Make it yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 md:px-6 bg-shit-light">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-shit-darker mb-10 md:mb-16">
            How It <span className="text-shit-brown">Works</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-shit-brown text-cream rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                1
              </div>
              <h4 className="font-bold text-shit-darker mb-1 md:mb-2 text-sm md:text-base">Connect Wallet</h4>
              <p className="text-shit-dark text-xs md:text-sm">
                Link your Solana wallet
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-shit-brown text-cream rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                2
              </div>
              <h4 className="font-bold text-shit-darker mb-1 md:mb-2 text-sm md:text-base">Create Token</h4>
              <p className="text-shit-dark text-xs md:text-sm">
                Name, symbol, supply
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-shit-brown text-cream rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                3
              </div>
              <h4 className="font-bold text-shit-darker mb-1 md:mb-2 text-sm md:text-base">Launch Pool</h4>
              <p className="text-shit-dark text-xs md:text-sm">
                We create Raydium pool
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-shit-brown text-cream rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                💩
              </div>
              <h4 className="font-bold text-shit-darker mb-1 md:mb-2 text-sm md:text-base">To The Moon</h4>
              <p className="text-shit-dark text-xs md:text-sm">
                Share and watch it fly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-shit-darker">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-cream mb-4 md:mb-6">
            Ready to <span className="text-gold">Launch</span>?
          </h3>
          <p className="text-lg md:text-xl text-shit-light mb-8 md:mb-10">
            Join the shittiest launchpad in the Solana ecosystem
          </p>
          <Link
            href="/create"
            className="inline-block bg-gold text-shit-darker px-8 md:px-10 py-4 md:py-5 rounded-xl text-lg md:text-xl font-bold hover:bg-gold-light transition-all hover:scale-105"
          >
            Launch Your Token
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-shit-darker text-shit-light py-6 md:py-8 px-4 md:px-6 border-t border-shit-dark">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gold font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">💩</span> SHITTER
          </div>
          <div className="flex gap-4 md:gap-6">
            <a href="#" className="hover:text-gold transition-colors text-sm md:text-base">
              Twitter
            </a>
            <a href="#" className="hover:text-gold transition-colors text-sm md:text-base">
              Telegram
            </a>
            <a href="#" className="hover:text-gold transition-colors text-sm md:text-base">
              Discord
            </a>
          </div>
          <div className="text-xs md:text-sm text-shit-medium">
            © 2026 Shitter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
