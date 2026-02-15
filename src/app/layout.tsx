import type { Metadata } from 'next'
import { DM_Serif_Display, Inter } from 'next/font/google'
import React from 'react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Rutland Farm Park | Family-Friendly Working Farm in Oakham',
    template: '%s | Rutland Farm Park',
  },
  description:
    'Visit our 18-acre family-friendly working farm park in Oakham, Rutland. Meet rare breed animals, enjoy family events, and explore the countryside.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Rutland Farm Park',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
