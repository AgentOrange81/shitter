"use client";

import { ReactNode } from "react";
import WalletContextProvider from "@/components/WalletProvider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
  );
}
