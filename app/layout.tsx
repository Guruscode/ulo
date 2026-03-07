import React from "react"
import type { Metadata } from 'next'
import { Figtree as Fig_Tree, Geist_Mono } from 'next/font/google'

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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${figTree.className} antialiased`}>{children}</body>
    </html>
  )
}
