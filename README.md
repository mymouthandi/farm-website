# Rutland Farm Park Website

A modern website for Rutland Farm Park built with **Next.js 15**, **Payload CMS 3**, and **Tailwind CSS v4**. Features a custom booking system with Stripe payments, CMS-managed content, and Docker-based deployment.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **CMS**: Payload CMS 3 (embedded in Next.js)
- **Database**: PostgreSQL
- **Payments**: Stripe Checkout
- **Email**: Resend
- **Deployment**: Docker (Dockploy / AWS ECS ready)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (or use Docker Compose)
- Stripe account (for bookings)
- Resend account (for emails)

### Local Development

1. **Clone and install dependencies:**

```bash
git clone <repo-url>
cd farm-website
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your database URL, Stripe keys, etc.
```

3. **Start PostgreSQL** (if not using Docker):

```bash
# Or use Docker Compose for just the database:
docker compose up db -d
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Access the site:**
   - Frontend: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - On first visit to /admin, you'll be prompted to create an admin user.

### Docker Deployment

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f app
```

## Project Structure

```
src/
├── app/
│   ├── (frontend)/         # Public website pages
│   │   ├── page.tsx        # Homepage
│   │   ├── visit/          # Visit info
│   │   ├── animals/        # Animals gallery
│   │   ├── events/         # Events & news
│   │   ├── faq/            # FAQ
│   │   ├── booking/        # Ticket booking
│   │   └── contact/        # Contact form
│   ├── (payload)/          # Payload CMS admin
│   ├── api/                # API routes
│   │   ├── bookings/       # Booking endpoints
│   │   ├── contact/        # Contact form endpoint
│   │   ├── webhooks/       # Stripe webhook
│   │   └── health/         # Health check
│   ├── sitemap.ts
│   └── robots.ts
├── collections/            # Payload CMS collections
│   ├── Animals.ts
│   ├── Bookings.ts
│   ├── ContactSubmissions.ts
│   ├── Events.ts
│   ├── FAQs.ts
│   ├── Media.ts
│   ├── TicketTypes.ts
│   └── Users.ts
├── globals/                # Payload CMS globals
│   ├── Homepage.ts         # Homepage content (AI-updatable)
│   ├── OpeningHours.ts     # Opening hours (AI-updatable)
│   └── SiteSettings.ts     # Site-wide settings
├── components/             # React components
│   ├── booking/            # Booking system components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                    # Utilities
│   ├── stripe.ts
│   ├── email.ts
│   ├── booking.ts
│   └── utils.ts
└── payload.config.ts       # Payload CMS configuration
```

## CMS Content Management

Access the admin panel at `/admin` to manage:

- **Homepage**: Hero text, announcement banner, highlights
- **Opening Hours**: Summer/winter hours, today override
- **Animals**: Add/edit animal profiles
- **Events**: Create events and news posts
- **FAQs**: Manage frequently asked questions
- **Ticket Types**: Set pricing for different ticket categories
- **Bookings**: View and manage bookings

## AI Agent Integration

The CMS exposes REST and GraphQL APIs at `/api` that can be used by AI agents (via WhatsApp, Telegram, etc.) to update content programmatically:

- `PATCH /api/globals/homepage` - Update homepage content
- `PATCH /api/globals/opening-hours` - Update opening hours
- `POST /api/events` - Create new events
- `GET /api/bookings` - Query bookings

Example: Update today's announcement via API:

```bash
curl -X PATCH http://localhost:3000/api/globals/homepage \
  -H "Authorization: Bearer <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"announcement": {"active": true, "message": "Lambing season starts today!", "type": "special"}}'
```

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Add your API keys to `.env`
3. For webhooks, set up an endpoint pointing to `/api/webhooks/stripe`
4. For local testing, use `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## Deployment to AWS

The Docker image is designed to run on:
- **AWS ECS/Fargate** with an ALB and CloudFront
- **Dockploy** on a VPS
- Any Docker-compatible hosting

For AWS, you'll also need:
- RDS PostgreSQL instance
- S3 bucket for media (configure S3 env vars)
- CloudFront distribution for CDN
