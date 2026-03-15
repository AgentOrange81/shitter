import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Scrolling Banner */}
      <div className="overflow-hidden bg-emerald-600 py-4">
        <div className="animate-scroll whitespace-nowrap">
          <span className="text-2xl font-bold mx-24">
            SHIT IN, SHIT OUT! • 
          </span>
          <span className="text-2xl font-bold mx-24">
            SHIT IN, SHIT OUT! • 
          </span>
          <span className="text-2xl font-bold mx-24">
            SHIT IN, SHIT OUT! • 
          </span>
          <span className="text-2xl font-bold mx-24">
            SHIT IN, SHIT OUT! • 
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
          <span className="text-emerald-500">SHIT</span>TER
        </h1>
        <p className="text-3xl font-bold text-white mb-2">
          Check this shit out!
        </p>
        <p className="text-xl text-zinc-400 mb-12">
          Trade. Launch. Socialize.
        </p>

        {/* Subdomains */}
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="https://screener.shitter.io"
            className="group px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-emerald-500 transition-all"
          >
            <div className="text-emerald-500 font-bold text-lg">Screener</div>
            <div className="text-zinc-500 text-sm">Token analytics</div>
          </Link>
          <Link
            href="https://launch.shitter.io"
            className="group px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-emerald-500 transition-all"
          >
            <div className="text-emerald-500 font-bold text-lg">Launch</div>
            <div className="text-zinc-500 text-sm">Launchpad</div>
          </Link>
          <Link
            href="https://social.shitter.io"
            className="group px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-emerald-500 transition-all"
          >
            <div className="text-emerald-500 font-bold text-lg">Social</div>
            <div className="text-zinc-500 text-sm">Community</div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-sm">
        <p>🐸 Built by degens, for degens</p>
      </footer>
    </div>
  );
}