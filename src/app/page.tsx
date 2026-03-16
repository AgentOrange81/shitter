"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Pre-generate random star data once (outside component)
const starData = Array.from({ length: 50 }, () => ({
  width: Math.random() * 3 + 1,
  height: Math.random() * 3 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 2,
}));

// Pre-generate hit counter once (outside component)
const initialHitCounter = 42000 + Math.floor(Math.random() * 70);

export default function Home() {
  const [time, setTime] = useState("");
  const hitCounter = initialHitCounter;

  useEffect(() => {
    // Live clock
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: true }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .star {
          animation: twinkle 2s ease-in-out infinite;
        }
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
        }
        .bevel-button {
          border: 2px solid;
          border-color: #d4a574 #5c3d2e #5c3d2e #d4a574;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
        }
        .bevel-button:active {
          border-color: #5c3d2e #d4a574 #d4a574 #5c3d2e;
        }
        .neon-text {
          text-shadow: 
            0 0 5px #ffd700,
            0 0 10px #ffd700,
            0 0 20px #ffd700,
            0 0 40px #b8860b;
        }
        .table-3d {
          border: 3px solid;
          border-color: #5c3d2e #d4a574 #d4a574 #5c3d2e;
        }
      `}</style>

      {/* Starry Background */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        {starData.map((star, i) => (
          <div
            key={i}
            className="star absolute bg-white rounded-full"
            style={{
              width: star.width + "px",
              height: star.height + "px",
              left: star.left + "%",
              top: star.top + "%",
              animationDelay: star.delay + "s",
            }}
          />
        ))}

        {/* Scanlines Overlay */}
        <div className="scanlines fixed inset-0 pointer-events-none z-50" />

        {/* Scrolling Banner - Pooh Brown/Gold */}
        <div className="overflow-hidden py-2 border-b-4 border-amber-900"
          style={{ background: "linear-gradient(180deg, #b8860b 0%, #8b6914 50%, #5c4a0f 100%)" }}>
          <div className="animate-scroll whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-cream font-mono text-sm mx-4">
                💩 WELCOME TO SHITTER.IO — DEGEN TOKEN TRADING — LAUNCH YOUR MEME COIN — SOLANA BASED — DYOR — NOT FINANCIAL ADVICE — HODL OR DIE — 💩
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gold neon-text mb-2">
              💩 SHITTER.IO
            </h1>
            <p className="text-cream font-mono text-sm">
              {time} | Visitors: {hitCounter.toLocaleString()}
            </p>
          </header>

          {/* Retro Table Layout */}
          <table className="w-full table-3d" 
            style={{ backgroundColor: "#1a120f" }} cellPadding="10">
            <thead>
              <tr>
                <th colSpan={3} className="text-center p-4" 
                  style={{ backgroundColor: "#2d1f0f" }}>
                  <div className="font-mono text-gold overflow-hidden">
                    <span className="inline-block animate-scroll">
                      *** WELCOME TO SHITTER.IO *** YOUR SOURCE FOR DEGEN TOKEN TRADING ***
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Left Column - Menu */}
                <td className="align-top w-48" style={{ backgroundColor: "#2d1f0f" }}>
                  <div className="font-mono text-sm space-y-2">
                    <Link href="/tokens" 
                      className="bevel-button px-3 py-2 font-mono text-sm hover:opacity-80 cursor-pointer block text-center"
                      style={{ backgroundColor: "#8b6914", color: "#ffd700" }}>
                      📊 TOKENS
                    </Link>
                    <Link href="/create" 
                      className="bevel-button px-3 py-2 font-mono text-sm hover:opacity-80 cursor-pointer block text-center"
                      style={{ backgroundColor: "#8b6914", color: "#ffd700" }}>
                      🚀 LAUNCHPAD
                    </Link>
                    <Link href="https://social.shitter.io" 
                      className="bevel-button px-3 py-2 font-mono text-sm hover:opacity-80 cursor-pointer block text-center"
                      style={{ backgroundColor: "#8b6914", color: "#ffd700" }}>
                      💬 SOCIAL
                    </Link>
                  </div>
                </td>

                {/* Center Column - Main Content */}
                <td className="align-top" style={{ backgroundColor: "#1a120f" }}>
                  <div className="font-mono text-left text-xs md:text-sm space-y-3 md:space-y-4 p-2 md:p-4 rounded" 
                    style={{ backgroundColor: "#2d1f0f", color: "#d4a574" }}>
                    <p>Welcome to Shitter — the ultimate degen trading platform on Solana.</p>
                    <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                      <li>🎯 <span style={{ color: "#ffd700" }}>Token Screener</span> — Real-time analytics</li>
                      <li>🚀 <span style={{ color: "#ffd700" }}>Launchpad</span> — Deploy your own tokens</li>
                      <li>💬 <span style={{ color: "#ffd700" }}>Social</span> — Connect with degens</li>
                    </ul>
                    <p className="text-center mt-3 md:mt-4" style={{ color: "#b8860b" }}>
                      ⚠️ WARNING: HIGH RISK — DYOR ⚠️
                    </p>
                  </div>
                </td>

                {/* Right Column - News (Bottom on mobile, hidden on small screens) */}
                <td className="align-top w-48 hidden md:table-cell" style={{ backgroundColor: "#2d1f0f" }}>
                  <div className="font-mono text-xs space-y-2">
                    <p className="text-gold font-bold border-b border-amber-900 pb-1">LATEST</p>
                    <p className="text-cream">• New token launches daily</p>
                    <p className="text-cream">• Community driven</p>
                    <p className="text-cream">• 100% degen approved</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <footer className="text-center mt-8 font-mono text-xs text-amber-700">
            <p>© 2026 SHITTER.IO — ALL RIGHTS RESERVED — BUILT ON SOLANA</p>
          </footer>
        </div>
      </div>
    </>
  );
}
