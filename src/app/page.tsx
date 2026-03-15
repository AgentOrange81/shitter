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
          border-color: #fff #808080 #808080 #fff;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
        }
        .bevel-button:active {
          border-color: #808080 #fff #fff #808080;
        }
        .neon-text {
          text-shadow: 
            0 0 5px #ff00ff,
            0 0 10px #ff00ff,
            0 0 20px #ff00ff,
            0 0 40px #ff00ff;
        }
        .table-3d {
          border: 3px solid;
          border-color: #808080 #fff #fff #808080;
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

        {/* Scrolling Banner */}
        <div className="overflow-hidden bg-red-600 py-2 border-b-4 border-red-800">
          <div className="animate-scroll whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-xl font-bold text-yellow-300 mx-12">
                🚧 UNDER CONSTRUCTION - SHITTER.IO - LAUNCHING SOON! 🚧
              </span>
            ))}
          </div>
        </div>

        {/* 3-Column Table Layout */}
        <div className="max-w-4xl mx-auto p-4 pt-8">
          <table className="w-full table-3d bg-zinc-900" cellPadding="10">
            <thead>
              <tr>
                <th colSpan={3} className="text-center p-4 bg-zinc-800">
                  <marquee direction="left" className="text-cyan-400 font-mono">
                    *** WELCOME TO SHITTER.IO *** YOUR SOURCE FOR DEGEN TOKEN TRADING ***
                  </marquee>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Left Column - Menu */}
                <td valign="top" className="bg-zinc-800 w-48">
                  <div className="text-center">
                    <p className="text-yellow-400 font-mono text-sm mb-4">📁 MENU</p>
                    <div className="flex flex-col gap-2">
                      <Link href="https://screener.shitter.io" 
                        className="bevel-button bg-blue-700 text-white px-4 py-2 font-mono text-sm hover:bg-blue-600 cursor-pointer block text-center">
                        📊 SCREENER
                      </Link>
                      <Link href="https://launch.shitter.io"
                        className="bevel-button bg-blue-700 text-white px-4 py-2 font-mono text-sm hover:bg-blue-600 cursor-pointer block text-center">
                        🚀 LAUNCHPAD
                      </Link>
                      <Link href="https://social.shitter.io"
                        className="bevel-button bg-blue-700 text-white px-4 py-2 font-mono text-sm hover:bg-blue-600 cursor-pointer block text-center">
                        💬 SOCIAL
                      </Link>
                    </div>
                    <div className="mt-8 text-zinc-500 font-mono text-xs">
                      <p>🕐 {time}</p>
                      <p className="mt-2">Visitors:</p>
                      <p className="text-red-500 font-mono">{hitCounter.toLocaleString()}</p>
                    </div>
                  </div>
                </td>

                {/* Center Column - Main Content */}
                <td valign="top" className="bg-zinc-900">
                  <div className="text-center">
                    <h1 className="font-mono text-4xl text-cyan-400 neon-text mb-4" 
                      style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                      SHITTER.IO
                    </h1>
                    <p className="text-yellow-400 font-mono mb-6">
                      ★ Trade. Launch. Socialize. ★
                    </p>
                    <div className="text-zinc-300 font-mono text-left text-sm space-y-4 p-4 bg-zinc-800 rounded">
                      <p>Welcome to Shitter — the ultimate degen trading platform on Solana.</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>🎯 <span className="text-cyan-400">Token Screener</span> — Real-time analytics</li>
                        <li>🚀 <span className="text-cyan-400">Launchpad</span> — Deploy your own tokens</li>
                        <li>💬 <span className="text-cyan-400">Social</span> — Connect with degens</li>
                      </ul>
                      <p className="text-center text-yellow-400 mt-4">
                        ⚠️ WARNING: HIGH RISK — DYOR ⚠️
                      </p>
                    </div>
                  </div>
                </td>

                {/* Right Column - News */}
                <td valign="top" className="bg-zinc-800 w-48">
                  <div className="text-center">
                    <p className="text-yellow-400 font-mono text-sm mb-4">📰 NEWS</p>
                    <div className="font-mono text-xs text-zinc-400 space-y-4">
                      <div className="border-b border-zinc-600 pb-2">
                        <p className="text-cyan-400">2024-01-15</p>
                        <p>Shitter v1.0 launched! 🚀</p>
                      </div>
                      <div className="border-b border-zinc-600 pb-2">
                        <p className="text-cyan-400">2024-02-01</p>
                        <p>Screener上线! 📊</p>
                      </div>
                      <div className="border-b border-zinc-600 pb-2">
                        <p className="text-cyan-400">2024-03-10</p>
                        <p>Social module added 💬</p>
                      </div>
                      <div>
                        <p className="text-red-400 animate-pulse">NEW!</p>
                        <p>Connect wallet to start!</p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-center p-2 bg-zinc-800">
                  <p className="text-zinc-500 text-xs font-mono">
                    Best viewed in Netscape Navigator 4.0 • 800x600 resolution • 16M colors
                  </p>
                  <p className="text-zinc-600 text-xs font-mono mt-1">
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