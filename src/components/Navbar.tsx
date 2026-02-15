'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Tractor } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/visit', label: 'Visit' },
  { href: '/animals', label: 'Our Animals' },
  { href: '/events', label: 'Events' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Tractor className="h-8 w-8 text-farm-green transition-transform group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="font-display text-lg leading-tight text-farm-green-dark">
                Rutland Farm Park
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">Oakham, Rutland</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-farm-green hover:bg-farm-green/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="ml-2 px-4 py-2 rounded-lg bg-farm-green text-white text-sm font-semibold hover:bg-farm-green-dark transition-colors shadow-sm"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-farm-green hover:bg-farm-green/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMobileOpen(false)}
              className="block mx-3 mt-3 px-4 py-2.5 rounded-lg bg-farm-green text-white text-center text-base font-semibold hover:bg-farm-green-dark transition-colors"
            >
              Book Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
