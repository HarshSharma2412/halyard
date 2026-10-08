import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { BagDrawer } from "@/components/BagDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnnouncementBar } from "@/components/AnnouncementBar";

export const metadata: Metadata = {
  metadataBase: new URL('https://halyard.studio'),
  title: {
    template: "%s | Halyard",
    default: "Halyard — Recycled Steel & 925 Silver Bracelets",
  },
  description:
    "Premium men's and unisex bracelets in recycled 316L stainless steel and hallmarked 925 sterling silver. Silver, gold and black finishes. Lifetime warranty.",
  openGraph: {
    siteName: "Halyard",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  keywords: ["men's bracelets", "stainless steel bracelet", "925 sterling silver", "recycled steel jewelry", "unisex bracelet"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main>{children}</main>
          <BagDrawer />
          <QuickViewModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
