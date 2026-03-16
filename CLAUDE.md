# CLAUDE.md - Shit Launcher

## Project Overview

**Shit Launcher** is a Solana meme coin launchpad using Raydium LaunchLab. Users can create tokens with random or vanity addresses.

- **URL:** https://launch.shitter.io
- **Repo:** https://github.com/AgentOrange81/shit-launcher
- **Tech:** Next.js 16, Tailwind CSS, Solana Web3.js, Raydium SDK
- **Architecture:** Standalone app, separate from screener.shitter.io and social.shitter.io

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app/create/page.tsx` | Token creation UI |
| `src/app/tokens/page.tsx` | Token listing page |
| `src/app/api/create-token/route.ts` | Raydium transaction builder |
| `src/app/api/upload-metadata/route.ts` | IPFS metadata upload |
| `src/lib/vanity.ts` | Vanity address generator (browser-side) |
| `src/components/WalletProvider.tsx` | Solana wallet connection |
| `.env.local` | Local env vars (RPC, keys) |

---

## Commands

```bash
npm install
npm run dev    # Local development
npm run build  # Production build
npm run lint   # ESLint
```

---

## Environment Variables (Vercel)

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_VANITY_API` | `https://larry.tailfb3d02.ts.net` | ✅ Set |
| `NEXT_PUBLIC_SOLANA_RPC` | `https://mainnet.helius-rpc.com/?api-key=adbe3b9c-b367-4dbe-b44c-5e2d1cdfeb9f` | ✅ Set |
| `PINATA_API_KEY` | `b5f705b08ca70ead7c00` | ✅ Set |
| `PINATA_API_SECRET` | `5c83b084ece18998994867f8e51b936b350626a7e8996f69b66aa7dac519b1e4` | ✅ Set |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | `7c1ec22b1bb28f2519fc76e091841b30` | ✅ Set |

---

## Important Notes

- **Decimals:** Raydium requires 6 decimals
- **Min supply:** 10M tokens minimum
- **Vanity generation:** Runs in browser (~1.7M attempts avg for "shit")
- **Wallet:** Uses Solana Wallet Adapter (Phantom, Backpack, etc.)
- **Mainnet only:** All transactions on Solana mainnet

### Security TODO

- [ ] **Tighten Helius API key** — Currently exposed via `NEXT_PUBLIC_` which exposes it to the browser. The key is origin-locked but for production:
  - Use a public RPC (Triton/QuickNode) for reads
  - Keep Helius key server-side for write transactions only
  - Or use a proxy route for RPC calls

---

## Recent Commits

| Commit | Description |
|--------|-------------|
| c62e916 | UI upgrades: animations, glassmorphism, enhanced shadows |
| 216206e | Add cancel/stop button for vanity search |
| 7d6e407 | Client-side vanity keypair generation |

---

*Updated 2026-03-15*