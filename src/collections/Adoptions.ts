import type { CollectionConfig } from 'payload'

export const Adoptions: CollectionConfig = {
  slug: 'adoptions',
  admin: {
    useAsTitle: 'adopterName',
    defaultColumns: ['adopterName', 'animal', 'tier', 'status', 'expiresAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
  },
  fields: [
    {
      name: 'adoptionReference',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'animal',
      type: 'relationship',
      relationTo: 'animals',
      required: true,
    },
    {
      name: 'tier',
      type: 'relationship',
      relationTo: 'adoption-tiers',
      required: true,
    },
    {
      name: 'adopterName',
      type: 'text',
      required: true,
    },
    {
      name: 'adopterEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'adopterPhone',
      type: 'text',
    },
    {
      name: 'isGift',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this adoption a gift for someone else?',
      },
    },
    {
      name: 'giftRecipientName',
      type: 'text',
      admin: {
        condition: (data: any) => data?.isGift,
        description: 'Name to appear on the certificate',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      admin: {
        description: 'Address for the physical adoption pack',
      },
      fields: [
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'county', type: 'text' },
        { name: 'postcode', type: 'text', required: true },
        { name: 'country', type: 'text', defaultValue: 'United Kingdom' },
      ],
    },
    {
      name: 'startsAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
        description: '12 months from start date',
      },
    },
    {
      name: 'packStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Preparing', value: 'preparing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
      ],
      defaultValue: 'pending',
      admin: {
        description: 'Physical adoption pack fulfilment status',
      },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: {
        position: 'sidebar',
        condition: (data: any) => data?.packStatus === 'shipped',
      },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending Payment', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'pending',
      required: true,
    },
  ],
}
