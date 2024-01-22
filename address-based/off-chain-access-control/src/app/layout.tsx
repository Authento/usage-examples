import WagmiProvider from "@/components/providers/wagmi";
import CosmosProvider from "@/components/providers/Cosmos";

import "@/styles/global.css";

export const metadata = {
  title: "Authento Integration Demo",
  description: "Demo for off-chain access control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CosmosProvider>
          <WagmiProvider>{children}</WagmiProvider>
        </CosmosProvider>
      </body>
    </html>
  );
}
