"use client";

import { ReactNode } from "react";
import { CosmosProvider } from "authento-react";
import WagmiProvider from "./wagmi";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CosmosProvider>
      <WagmiProvider>{children}</WagmiProvider>
    </CosmosProvider>
  );
}
