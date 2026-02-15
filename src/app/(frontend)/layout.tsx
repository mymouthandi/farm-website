import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import { JsonLd } from '@/components/JsonLd'
import { CartProvider } from '@/components/cart/CartProvider'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="frontend-shell">
        <JsonLd />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CookieConsent />
      </div>
    </CartProvider>
  )
}
