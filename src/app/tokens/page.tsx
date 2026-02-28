import Link from "next/link";

// Sample tokens for demo
const SAMPLE_TOKENS = [
  {
    name: "Doge",
    symbol: "DOGE",
    description: "Much wow, very coin",
    image: "🐕",
    price: "$0.12",
    change: "+5.2%",
    marketCap: "$1.2B",
  },
  {
    name: "Shiba Inu",
    symbol: "SHIB",
    description: "Dogecoin killer",
    image: "🐕‍🦺",
    price: "$0.000021",
    change: "+2.1%",
    marketCap: "$12.4B",
  },
  {
    name: "Pepe",
    symbol: "PEPE",
    description: "Meme coin of the people",
    image: "🐸",
    price: "$0.0000018",
    change: "+12.5%",
    marketCap: "$780M",
  },
  {
    name: "Bonk",
    symbol: "BONK",
    description: "Solana's dog coin",
    image: "🐶",
    price: "$0.000028",
    change: "-1.3%",
    marketCap: "$280M",
  },
  {
    name: "Wif",
    symbol: "WIF",
    description: "Dog with hat",
    image: "🎩🐕",
    price: "$2.45",
    change: "+8.7%",
    marketCap: "$2.4B",
  },
  {
    name: "Goat",
    symbol: "GOAT",
    description: "Greatest of all time",
    image: "🐐",
    price: "$0.32",
    change: "+15.2%",
    marketCap: "$320M",
  },
];

export default function Tokens() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-shit-darker text-cream px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold">
            SHITTER
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="#tokens" className="hover:text-gold transition-colors">
              Tokens
            </Link>
            <Link href="#how-it-works" className="hover:text-gold transition-colors">
              How It Works
            </Link>
            <Link
              href="/create"
              className="bg-gold text-shit-darker px-4 py-2 rounded-lg font-semibold hover:bg-gold-light transition-colors"
            >
              Launch Token
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-shit-darker text-cream py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Live <span className="text-gold">Tokens</span>
          </h1>
          <p className="text-xl text-shit-light">
            The shittiest tokens on Solana
          </p>
        </div>
      </section>

      {/* Tokens Grid */}
      <section id="tokens" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_TOKENS.map((token) => (
              <div
                key={token.symbol}
                className="bg-white rounded-2xl shadow-lg border-2 border-shit-light overflow-hidden hover:border-shit-brown transition-colors cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{token.image}</div>
                    <div>
                      <h3 className="text-xl font-bold text-shit-darker">
                        {token.name}
                      </h3>
                      <span className="text-shit-medium font-mono">
                        {token.symbol}
                      </span>
                    </div>
                  </div>
                  <p className="text-shit-medium text-sm mb-4">
                    {token.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-shit-light">
                    <div>
                      <span className="text-shit-medium text-xs">Price</span>
                      <p className="font-bold text-shit-darker">{token.price}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-shit-medium text-xs">24h</span>
                      <p
                        className={`font-bold ${
                          token.change.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {token.change}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-shit-medium text-xs">MCap</span>
                      <p className="font-bold text-shit-darker">
                        {token.marketCap}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-shit-light">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-shit-darker mb-4">
            Launch Your Token
          </h2>
          <p className="text-shit-medium mb-8">
            Be the next big meme coin on Solana
          </p>
          <Link
            href="/create"
            className="inline-block bg-gold text-shit-darker px-8 py-4 rounded-xl text-xl font-bold hover:bg-gold-light transition-all hover:scale-105"
          >
            Create Token
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
