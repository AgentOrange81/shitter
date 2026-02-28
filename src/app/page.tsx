import Link from "next/link";
import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-shit-darker text-cream px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gold">SHITTER</h1>
          <div className="flex gap-6 items-center">
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-shit-darker text-cream py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            Launch Your{" "}
            <span className="text-gold">Meme Coin</span>
            <br />
            on Solana
          </h2>
          <p className="text-xl md:text-2xl text-shit-light mb-10 max-w-2xl mx-auto">
            The shittiest launchpad in crypto. Create tokens, launch on Raydium, and
            let the memes flow.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/create"
              className="bg-gold text-shit-darker px-8 py-4 rounded-xl text-lg font-bold hover:bg-gold-light transition-all hover:scale-105"
            >
              Create Token
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-shit-light text-shit-light px-8 py-4 rounded-xl text-lg font-semibold hover:bg-shit-light hover:text-shit-darker transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-shit-darker mb-16">
            Why <span className="text-shit-brown">Shitter</span>?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-shit-light">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-bold text-shit-darker mb-3">Lightning Fast</h4>
              <p className="text-shit-medium">
                Deploy to Raydium in seconds. Our streamlined process gets your token
                live without the hassle.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-shit-light">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-bold text-shit-darker mb-3">Low Fees</h4>
              <p className="text-shit-medium">
                Built on Solana means minimal gas. Keep more of your gains for
                yourself and your community.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-shit-light">
              <div className="text-4xl mb-4">🎨</div>
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
      <section id="how-it-works" className="py-20 px-6 bg-shit-light">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-shit-darker mb-16">
            How It <span className="text-shit-brown">Works</span>
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-shit-brown text-cream rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-shit-darker mb-2">Connect Wallet</h4>
              <p className="text-shit-dark text-sm">
                Link your Solana wallet to get started
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-shit-brown text-cream rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-shit-darker mb-2">Create Token</h4>
              <p className="text-shit-dark text-sm">
                Name, symbol, supply, and image
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-shit-brown text-cream rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-shit-darker mb-2">Launch Pool</h4>
              <p className="text-shit-dark text-sm">
                We create the Raydium liquidity pool
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-shit-brown text-cream rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold text-shit-darker mb-2">To The Moon</h4>
              <p className="text-shit-dark text-sm">
                Share your token and watch it fly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-shit-darker">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-cream mb-6">
            Ready to <span className="text-gold">Launch</span>?
          </h3>
          <p className="text-xl text-shit-light mb-10">
            Join the shittiest launchpad in the Solana ecosystem
          </p>
          <Link
            href="/create"
            className="inline-block bg-gold text-shit-darker px-10 py-5 rounded-xl text-xl font-bold hover:bg-gold-light transition-all hover:scale-105"
          >
            Launch Your Token
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-shit-darker text-shit-light py-8 px-6 border-t border-shit-dark">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gold font-bold text-xl">SHITTER</div>
          <div className="flex gap-6">
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
