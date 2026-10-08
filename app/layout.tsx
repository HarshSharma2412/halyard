import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { BagDrawer } from "@/components/BagDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import defaultSettings from "@/lib/settings.json";

export const metadata: Metadata = {
  metadataBase: new URL('https://halyard.studio'),
  title: {
    template: `%s | ${defaultSettings.brandName}`,
    default: `${defaultSettings.brandName} — Recycled Steel & 925 Silver Bracelets`,
  },
  description:
    "Premium men's and unisex bracelets in recycled 316L stainless steel and hallmarked 925 sterling silver. Silver, gold and black finishes. Lifetime warranty.",
  openGraph: {
    siteName: defaultSettings.brandName,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  keywords: ["men's bracelets", "stainless steel bracelet", "925 sterling silver", "recycled steel jewelry", "unisex bracelet"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Inject settings-driven CSS variable overrides as an inline <style> tag.
  // In dev, Next.js HMR picks up settings.json changes within seconds.
  const s = defaultSettings as Record<string, string>;
  const customCss = `
    :root {
      --accent:     ${s.accentColor};
      --accent-hi:  ${s.accentHi};
      --accent-lo:  ${s.accentLo};
      --bg:         ${s.bgDark};
      --bg-2:       ${s.bgDark2};
      --bg-3:       ${s.bgDark3};
    }
  `.trim();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Dynamic brand colour overrides from lib/settings.json */}
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
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
