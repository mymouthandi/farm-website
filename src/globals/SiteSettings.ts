import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Rutland Farm Park',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Family-Friendly Working Farm Attraction',
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          defaultValue: 'info@rutlandfarmpark.com',
        },
        {
          name: 'phone',
          type: 'text',
          defaultValue: '01572 722122',
        },
        {
          name: 'address',
          type: 'group',
          fields: [
            { name: 'line1', type: 'text', defaultValue: 'Uppingham Road' },
            { name: 'line2', type: 'text' },
            { name: 'town', type: 'text', defaultValue: 'Oakham' },
            { name: 'postcode', type: 'text', defaultValue: 'LE15 6JD' },
            { name: 'country', type: 'text', defaultValue: 'United Kingdom' },
          ],
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'tiktok', type: 'text' },
      ],
    },
    {
      name: 'bookingCapacityPerSlot',
      type: 'number',
      defaultValue: 100,
      required: true,
      admin: {
        description: 'Maximum number of visitors per day',
      },
    },
    {
      name: 'googleMapsEmbedUrl',
      type: 'text',
      admin: {
        description: 'Google Maps embed URL for the farm location',
      },
    },
  ],
}
