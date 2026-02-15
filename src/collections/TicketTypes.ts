import type { CollectionConfig } from 'payload'

export const TicketTypes: CollectionConfig = {
  slug: 'ticket-types',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'weekdayPrice', 'weekendPrice', 'active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Adult, Child, Family, Concession',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'e.g. "2 Adults, 2 Children / 1 Adult, 3 Children"',
      },
    },
    {
      name: 'weekdayPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in pence (e.g. 1000 = £10.00)',
      },
    },
    {
      name: 'weekendPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in pence for weekends, bank holidays & school holidays',
      },
    },
    {
      name: 'maxPerBooking',
      type: 'number',
      defaultValue: 10,
      min: 1,
      admin: {
        description: 'Maximum quantity per booking',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
