# Shitter - Meme Coin Launchpad

## Project Overview

- **Name:** Shitter
- **Type:** Meme coin launchpad platform
- **Target:** Solana ecosystem (Raydium AMM)
- **Status:** Planning

## Features

### Phase 1: MVP

1. **Landing Page**
   - Hero section with branding
   - Features overview
   - How it works
   - CTA for token creation
   - Footer with links

2. **Token Creation Interface**
   - Token name input
   - Token symbol input
   - Description
   - Supply amount
   - Image/logo upload
   - Social links (Twitter, Telegram)
   - Launch on Raydium (create liquidity pool)

### Phase 2 (Future)

- Social media app
- Dexscreener clone

---

## Tech Stack

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Solana Web3.js, Raydium SDK
- **Hosting:** Vercel

---

## Pages Structure

```
/                 - Landing page
/create           - Token creation interface
/launch/[token]   - Token page (future)
```

---

## Design Vibe

- Meme culture aesthetic
- Bold, fun, slightly irreverent (fits "Shitter")
- Brown/tan/cream color scheme (shit brown)
- Gold or green accent for pop
- Fast, snappy animations

---

## Solana Integration

### Raydium LaunchLab

Raydium has a built-in token launch platform called **LaunchLab** with two modes:

**JustSendit** — Quick launch, default bonding curve settings
1. Name + Ticker + Description (optional)
2. Image/GIF (128x128 min, 5MB max)
3. Optional social links
4. Sign with wallet → Token live!
5. Graduats to AMM pool at 85 SOL

**LaunchLab (Custom)** — Full customization
- Total supply + SOL raise target (min 30 SOL)
- % of supply on curve (51-80%)
- Vesting options
- Post-migration fee share (earn 10% LP fees)

### SDK

```bash
yarn add @raydium-io/raydium-sdk-v2
```

- GitHub: raydium-io/raydium-sdk-v2
- Demos: raydium-sdk-V2-demo

---

## Questions

- **Colors** — Brown (shit brown), tan, cream - meme aesthetic
- [ ] Which Solana devnet/testnet for testing
- [ ] Raydium pool creation flow details

---

*Created: 2026-02-28*
