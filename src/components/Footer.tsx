import Link from 'next/link'
import { Tractor, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-farm-green-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Tractor className="h-8 w-8 text-farm-green-light" />
              <span className="font-display text-xl text-white">Rutland Farm Park</span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              An 18-acre family-friendly working farm park in the Market town of Oakham,
              England&apos;s smallest County, Rutland.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: '/visit', label: 'Plan Your Visit' },
                { href: '/animals', label: 'Our Animals' },
                { href: '/events', label: 'Events & News' },
                { href: '/booking', label: 'Book Tickets' },
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-farm-green-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-display text-lg mb-4">Opening Hours</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <p className="font-semibold text-white">Summer</p>
                <p>Tuesday &ndash; Sunday: 10am &ndash; 5pm</p>
                <p className="text-xs">(Last entry 4:30pm)</p>
              </div>
              <div>
                <p className="font-semibold text-white">Winter</p>
                <p>Tuesday &ndash; Sunday: 10am &ndash; 4pm</p>
                <p className="text-xs">(Last entry 3:00pm)</p>
              </div>
              <p className="text-xs text-gray-400">Monday closed (except Bank Holidays &amp; School Holidays)</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-farm-green-light" />
                <span>Uppingham Road, Oakham, LE15 6JD, United Kingdom</span>
              </li>
              <li>
                <a href="tel:01572722122" className="flex items-center gap-2 hover:text-farm-green-light transition-colors">
                  <Phone className="h-4 w-4 shrink-0 text-farm-green-light" />
                  01572 722122
                </a>
              </li>
              <li>
                <a href="mailto:info@rutlandfarmpark.com" className="flex items-center gap-2 hover:text-farm-green-light transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-farm-green-light" />
                  info@rutlandfarmpark.com
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Rutland Farm Park. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
