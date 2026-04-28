"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export function FacebookPixel({ pixelId }: { pixelId?: string | null }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pixelId) return;
    // Dispara PageView a cada mudança de rota
    // @ts-ignore
    if (typeof window !== 'undefined' && window.fbq) {
      // @ts-ignore
      window.fbq('track', 'PageView');
    }
  }, [pathname, pixelId]);

  if (!pixelId) return null;

  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
        `,
      }}
    />
  );
}
