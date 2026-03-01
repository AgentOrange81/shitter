# Shitter - Solana Meme Coin Launchpad

A meme coin launchpad on Solana using Raydium LaunchLab. Create tokens with random or vanity addresses ending in "shit".

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Blockchain:** Solana Web3.js
- **Token Protocol:** Raydium LaunchPad SDK (@raydium-io/raydium-sdk-v2)
- **Wallet:** @solana/wallet-adapter
- **Deployment:** Vercel

## Architecture

### Client-Side (`/src/app`)
- **Wallet Connection:** Solana Wallet Adapter
- **Vanity Generation:** Browser-based keypair search (loops until address ends in "shit")
- **Token Creation Form:** Collects name, symbol, supply, curve settings, socials

### Server-Side API (`/src/app/api`)
- `/api/create-token` - Builds Raydium LaunchPad transaction
- `/api/upload-metadata` - Uploads token metadata to IPFS via Pinata

### Key Libraries
- `@solana/web3.js` - Solana interactions
- `@solana/wallet-adapter-react` - Wallet connection UI
- `@raydium-io/raydium-sdk-v2` - Raydium LaunchPad integration
- `@solana/spl-token` - Token operations
- `pinata-web3` - IPFS metadata storage

## How It Works

### Token Creation Flow

1. **User fills form:**
   - Token name, symbol, description
   - Supply (e.g., 1,000,000,000)
   - Initial SOL to raise (e.g., 85 SOL)
   - Curve percentage (e.g., 80% of supply on bonding curve)

2. **Mint Address Options:**
   - **Random:** Instant keypair generation
   - **Vanity (shit):** Browser loops generating keypairs until address ends in "shit" (~1.7M average attempts)
   - **Custom:** User provides own mint address

3. **Server builds transaction:**
   - Uses Raydium SDK to create launchpad pool
   - Returns serialized transaction (base64)

4. **Client signs & submits:**
   - Wallet signs the transaction
   - For vanity: also signs with mint keypair private key
   - Submits to Solana network

### Vanity Search Implementation

```typescript
// /src/lib/vanity.ts
const targetSuffix = "shit";
// Loops generating Keypair until publicKey ends with "shit"
// Reports progress every 25k attempts
// Can be cancelled via cancelVanitySearch()
```

### Raydium SDK Integration

```typescript
// /src/app/api/create-token/route.ts
const result = await raydium.launchpad.createLaunchpad({
  mintA: mintPubkey,
  decimals: 6,
  name,
  symbol,
  configId, // Raydium launch config
  migrateType: "cpmm",
  supply: supplyBN,
  totalSellA,
  totalFundRaisingB,
  // ... curve parameters
});
```

## Environment Variables

```env
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
PINATA_JWT=your_pinata_jwt
```

## Development

```bash
cd shitter
npm install
npm run dev
```

## Deployment

```bash
vercel --prod
```

Deployed to: **https://shitter-red.vercel.app**

## Important Notes

- **Mint decimals:** Raydium LaunchPad requires 6 decimals
- **Minimum supply:** Must meet Raydium's min supply requirement
- **Vanity generation:** Runs in browser to avoid server load. ~1.7M average attempts for 4-char suffix
- **Custom mints:** User must have the private key to sign transactions

## History

| Commit | Description |
|--------|-------------|
| 216206e | Add cancel/stop button for vanity search |
| 7d6e407 | Add client-side vanity keypair generation |
| 539b8d8 | Add wallet signing flow structure |
| c4eca8e | Add Pinata metadata upload API |
| b5570a1 | Add mint type option: random/vanity/custom |
| 47fa49d | Add Raydium SDK and LaunchLab integration |
| 420fce3 | Initial commit |
