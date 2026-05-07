import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "@/lib/store/shop-store";

export const metadata: Metadata = {
  title: "Rājavastra · Heritage Sarees, Hand-woven in Bharat",
  description:
    "Curated heirloom sarees from the master weavers of Banaras, Kanchipuram and beyond. Hand-loomed, hand-dyed, lovingly delivered.",
  metadataBase: new URL("https://rajavastra.example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@1,300;1,400;1,500&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-ivory)] text-[var(--color-noir)]">
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
