# Shitter - Meme Coin Launchpad

## Project Overview

- **Name:** Shitter
- **Type:** Meme coin launchpad platform
- **Target:** Solana ecosystem (Raydium AMM)
- **Status:** In Development

## Features

### Phase 1: MVP (Current)

1. **Landing Page** ✅
   - Hero section with branding + 💩 emoji
   - Features overview
   - How it works
   - CTA for token creation
   - Footer with links
   - Mobile responsive

2. **Token Creation Interface** 🔄
   - Token name input ✅
   - Token symbol input ✅
   - Description ✅
   - Supply amount ✅
   - Image/logo upload ✅
   - Social links (Twitter, Telegram, Website) ✅
   - Wallet connection required ✅
   - API endpoint for creation ✅
   - **Raydium pool creation** — To do

3. **Token Gallery** ✅
   - Sample token display
   - Price, market cap, 24h change

### Phase 2 (Future)

- Social media app
- Dexscreener clone

---

## Tech Stack

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Wallet:** @solana/wallet-adapter-react
- **Blockchain:** @solana/web3.js, @solana/spl-token
- **Integration:** @raydium-io/raydium-sdk-v2
- **Hosting:** Vercel

---

## Pages Structure

```
/                 - Landing page (✅)
/tokens           - Token gallery (✅)
/create           - Token creation interface (🔄)
/api/create-token - Token creation API (🔄)
/launch/[token]   - Token page (future)
```

---

## Design Vibe

- Meme culture aesthetic
- Bold, fun, slightly irreverent (fits "Shitter")
- Brown/tan/cream color scheme (shit brown)
- 💩 emoji throughout (bouncing in hero)
- Gold accents
- Mobile responsive with hamburger menu

---

## Solana Integration

### Raydium SDK V2

**Install:**
```bash
yarn add @raydium-io/raydium-sdk-v2
```

**Basic Setup:**
```typescript
import { Raydium } from "@raydium-io/raydium-sdk-v2";

const raydium = await Raydium.load({
  connection,
  owner, // wallet keypair
  signAllTransactions, // from wallet adapter
});
```

### Key SDK Methods

| Feature | Method |
|---------|--------|
| Token List | `raydium.api.getTokenList()` |
| Pool Info | `raydium.api.fetchPoolByMints()` |
| Create Pool | `raydium.cpmm.createPool()` |
| Add Liquidity | `raydium.cpmm.deposit()` |
| Swap | SDK swap functions |

### LaunchLab Integration

For actual token launches, we can use Raydium's LaunchLab which handles:
- Bonding curve creation
- Auto-pool graduation at threshold (85 SOL)
- Fee sharing

### Important Notes

1. **Mainnet only** — SDK API doesn't fully support devnet
2. **Pool sync** — New pools take ~minutes to sync to API
3. **Initial liquidity** — Need ~4+ SOL for pool creation
4. **Priority fees** — Set higher fees for congested times

---

## Current Tasks

- [x] Landing page with mobile responsive
- [x] Token creation form UI
- [x] Wallet connection
- [ ] Actual token minting (SPL creation)
- [ ] Raydium pool creation
- [ ] Token page (view created tokens)

---

## Environment Variables

```env
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
# or devnet: https://api.devnet.solana.com
```

---

*Last updated: 2026-02-28*
