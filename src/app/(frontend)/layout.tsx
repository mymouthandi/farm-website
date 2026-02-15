import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import { JsonLd } from '@/components/JsonLd'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieConsent />
    </>
  )
}
