"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [time, setTime] = useState("");
  const [hitCounter, setHitCounter] = useState(0);

  useEffect(() => {
    // Live clock
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: true }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Fake hit counter - random between 42000-42069
    setHitCounter(42000 + Math.floor(Math.random() * 70));

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
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 2 + "s",
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
              <span key={i} className="text-xl font-bold text-black mx-12">
                🚧 UNDER CONSTRUCTION - SHITTER.IO - LAUNCHING SOON! 🚧
              </span>
            ))}
          </div>
        </div>

        {/* 3-Column Table Layout */}
        <div className="max-w-4xl mx-auto p-4 pt-8">
          <table className="w-full table-3d" 
            style={{ backgroundColor: "#1a1208" }} cellPadding="10">
            <thead>
              <tr>
                <th colSpan={3} className="text-center p-4" 
                  style={{ backgroundColor: "#2d1f0f" }}>
                  <marquee direction="left" className="font-mono" 
                    style={{ color: "#ffd700" }}>
                    *** WELCOME TO SHITTER.IO *** YOUR SOURCE FOR DEGEN TOKEN TRADING ***
                  </marquee>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Left Column - Menu */}
                <td valign="top" className="w-48" style={{ backgroundColor: "#2d1f0f" }}>
                  <div className="text-center">
                    <p className="font-mono text-sm mb-4" style={{ color: "#ffd700" }}>📁 MENU</p>
                    <div className="flex flex-col gap-2">
                      <Link href="https://screener.shitter.io" 
                        className="bevel-button px-4 py-2 font-mono text-sm hover:opacity-80 cursor-pointer block text-center"
                        style={{ backgroundColor: "#8b6914", color: "#ffd700" }}>
                        📊 SCREENER
                      </Link>
                      <Link href="https://launch.shitter.io"
                        className="bevel-button px-4 py-2 font-mono text-sm hover:opacity-80 cursor-pointer block text-center"
                        style={{ backgroundColor: "#8b6914", color: "#ffd700" }}>
                        🚀 LAUNCHPAD
                      </Link>
                      <Link href="https://social.shitter.io"
                        className="bevel-button px-4 py-2 font-mono text-sm hover:opacity-80 cursor-pointer block text-center"
                        style={{ backgroundColor: "#8b6914", color: "#ffd700" }}>
                        💬 SOCIAL
                      </Link>
                    </div>
                    <div className="mt-8 font-mono text-xs" style={{ color: "#8b7355" }}>
                      <p>🕐 {time}</p>
                      <p className="mt-2">Visitors:</p>
                      <p className="font-mono" style={{ color: "#ffd700" }}>{hitCounter.toLocaleString()}</p>
                    </div>
                  </div>
                </td>

                {/* Center Column - Main Content */}
                <td valign="top" style={{ backgroundColor: "#1a1208" }}>
                  <div className="text-center">
                    <h1 className="font-mono text-4xl neon-text mb-4" 
                      style={{ color: "#ffd700", fontFamily: '"Comic Sans MS", cursive' }}>
                      SHITTER.IO
                    </h1>
                    <p className="font-mono mb-6" style={{ color: "#b8860b" }}>
                      ★ Trade. Launch. Socialize. ★
                    </p>
                    <div className="font-mono text-left text-sm space-y-4 p-4 rounded" 
                      style={{ backgroundColor: "#2d1f0f", color: "#d4a574" }}>
                      <p>Welcome to Shitter — the ultimate degen trading platform on Solana.</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>🎯 <span style={{ color: "#ffd700" }}>Token Screener</span> — Real-time analytics</li>
                        <li>🚀 <span style={{ color: "#ffd700" }}>Launchpad</span> — Deploy your own tokens</li>
                        <li>💬 <span style={{ color: "#ffd700" }}>Social</span> — Connect with degens</li>
                      </ul>
                      <p className="text-center mt-4" style={{ color: "#b8860b" }}>
                        ⚠️ WARNING: HIGH RISK — DYOR ⚠️
                      </p>
                    </div>
                  </div>
                </td>

                {/* Right Column - News */}
                <td valign="top" className="w-48" style={{ backgroundColor: "#2d1f0f" }}>
                  <div className="text-center">
                    <p className="font-mono text-sm mb-4" style={{ color: "#ffd700" }}>📰 NEWS</p>
                    <div className="font-mono text-xs space-y-4" style={{ color: "#8b7355" }}>
                      <div className="border-b border-amber-900 pb-2">
                        <p style={{ color: "#ffd700" }}>2024-01-15</p>
                        <p>Shitter v1.0 launched! 🚀</p>
                      </div>
                      <div className="border-b border-amber-900 pb-2">
                        <p style={{ color: "#ffd700" }}>2024-02-01</p>
                        <p>Screener上线! 📊</p>
                      </div>
                      <div className="border-b border-amber-900 pb-2">
                        <p style={{ color: "#ffd700" }}>2024-03-10</p>
                        <p>Social module added 💬</p>
                      </div>
                      <div>
                        <p className="animate-pulse" style={{ color: "#ffd700" }}>NEW!</p>
                        <p>Connect wallet to start!</p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-center p-2" style={{ backgroundColor: "#2d1f0f" }}>
                  <p className="text-xs font-mono" style={{ color: "#5c4a0f" }}>
                    Best viewed in Netscape Navigator 4.0 • 800x600 resolution • 16M colors
                  </p>
                  <p className="text-xs font-mono mt-1" style={{ color: "#4a3a0d" }}>
                    © 2024 Shitter.io • Send bugs to /dev/null
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}