"use client";

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

export default function ConnectWallet() {
  const { setVisible } = useWalletModal();
  const { publicKey, connected } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <button
      onClick={() => setVisible(true)}
      className="bg-gold text-shit-darker px-4 py-2 rounded-lg font-semibold hover:bg-gold-light transition-colors"
    >
      {connected && publicKey ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          {truncateAddress(publicKey.toString())}
        </span>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
}
