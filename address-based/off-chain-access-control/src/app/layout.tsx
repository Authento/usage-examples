import { Providers } from "@/components/providers/Providers";
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
