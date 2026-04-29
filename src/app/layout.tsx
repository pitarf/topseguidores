import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getSystemSettings } from "@/services/settings";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettings();

  return {
    title: settings.siteTitle,
    description: settings.siteDescription,
    keywords: settings.siteKeywords,
    icons: {
      icon: settings.faviconUrl || "/icon.svg",
    },
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [
        {
          url: settings.logoUrl || "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

import { PurchaseNotifications } from "@/components/PurchaseNotifications";
import { CheckoutModal } from "@/components/CheckoutModal";
import { HowItWorksWrapper } from "@/components/HowItWorksWrapper";
import { FacebookPixel } from "@/components/FacebookPixel";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSystemSettings();

  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased selection:bg-primary selection:text-white`}
      >
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster position="bottom-right" richColors theme="dark" />
        <PurchaseNotifications />
        <CheckoutModal />
        <HowItWorksWrapper />
        <FacebookPixel pixelId={settings.fbPixelId} />
      </body>
    </html>
  );
}
