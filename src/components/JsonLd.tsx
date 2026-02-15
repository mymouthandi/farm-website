export function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Rutland Farm Park',
    description:
      'An 18-acre family-friendly working farm park in Oakham, Rutland, featuring rare breed animals, family events, and a tea room.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rutlandfarmpark.co.uk',
    telephone: '01572 722122',
    email: 'info@rutlandfarmpark.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Uppingham Road',
      addressLocality: 'Oakham',
      postalCode: 'LE15 6JD',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.6661,
      longitude: -0.725,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '17:00',
        validFrom: '2026-03-29',
        validThrough: '2026-10-25',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '16:00',
        validFrom: '2026-10-26',
        validThrough: '2027-03-28',
      },
    ],
    isAccessibleForFree: false,
    publicAccess: true,
    touristType: 'Families',
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
