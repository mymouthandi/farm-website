import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Animals } from './collections/Animals'
import { Events } from './collections/Events'
import { FAQs } from './collections/FAQs'
import { TicketTypes } from './collections/TicketTypes'
import { Bookings } from './collections/Bookings'
import { ContactSubmissions } from './collections/ContactSubmissions'

import { SiteSettings } from './globals/SiteSettings'
import { OpeningHours } from './globals/OpeningHours'
import { Homepage } from './globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Rutland Farm Park',
    },
  },
  collections: [
    Users,
    Media,
    Animals,
    Events,
    FAQs,
    TicketTypes,
    Bookings,
    ContactSubmissions,
  ],
  globals: [
    SiteSettings,
    OpeningHours,
    Homepage,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    seoPlugin({
      collections: ['events'],
      globals: ['homepage'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: any) => `${doc?.title || 'Rutland Farm Park'} | Rutland Farm Park`,
      generateDescription: ({ doc }: any) => doc?.excerpt || 'Visit our 18-acre family-friendly working farm park in Oakham, Rutland.',
    }),
  ],
})
