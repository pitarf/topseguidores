import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Script from "next/script";
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
  const url = process.env.NEXT_PUBLIC_APP_URL || "https://viralizareels.com";

  return {
    metadataBase: new URL(url),
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteTitle}`
    },
    description: settings.siteDescription,
    keywords: settings.siteKeywords,
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: settings.faviconUrl || "/favicon.png",
      apple: settings.faviconUrl || "/favicon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      url: "./",
      siteName: settings.siteTitle,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: settings.logoUrl || "/og-image.png",
          width: 1200,
          height: 630,
          alt: settings.siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [settings.logoUrl || "/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

import { PurchaseNotifications } from "@/components/PurchaseNotifications";
import { CheckoutModal } from "@/components/CheckoutModal";
import { HowItWorksWrapper } from "@/components/HowItWorksWrapper";
import { FacebookPixel } from "@/components/FacebookPixel";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSystemSettings();
  
  // Tag GTM padrão solicitada caso nenhuma outra seja definida
  const defaultGtm = `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TLZXFQ8D');</script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    </script>
    <!-- End Google Tag Manager -->
  `;

  const headerTagsToRender = settings.customHeaderTags?.trim() ? settings.customHeaderTags : defaultGtm;

  return (
    <html lang="pt-BR" className="dark">
      <head>
        {headerTagsToRender && (
          <div
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: headerTagsToRender }}
          />
        )}
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased selection:bg-primary selection:text-white`}
      >
        {/* Fallback de noscript do GTM */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TLZXFQ8D"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z6MPV4SH16"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z6MPV4SH16');
          `}
        </Script>
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster position="top-right" richColors theme="dark" />
        <PurchaseNotifications enabled={settings.showNotifications} />
        <CheckoutModal />
        <HowItWorksWrapper />
        <FacebookPixel pixelId={settings.fbPixelId} />
        <WhatsAppButton number={settings.whatsappNumber} />
      </body>
    </html>
  );
}
