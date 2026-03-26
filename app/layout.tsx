import React from "react"
import type { Metadata } from 'next'
import Script from 'next/script'
import { Figtree as Fig_Tree, Geist_Mono } from 'next/font/google'

import { AppProviders } from '@/components/providers/app-providers'
import CookieBanner from '@/components/site/cookie-banner'
import './globals.css'

const figTree = Fig_Tree({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ulo - Premium Real Estate Platform',
  description: 'Discover your dream property with Ulo',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${figTree.className} antialiased`}>
        <AppProviders>
          {children}
          <CookieBanner />
        </AppProviders>

        {/* Tawk.to Live Chat */}
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),
                  s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/69bcda1e25f53e1c37bb986d/1jk4r8239';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
