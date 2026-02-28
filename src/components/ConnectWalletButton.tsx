"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWallet() {
  const { publicKey, connected } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      <WalletMultiButton className="!bg-gold !text-shit-darker !font-semibold !rounded-lg hover:!bg-gold-light transition-colors" />
    </div>
  );
}
