import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderReference',
    defaultColumns: ['orderReference', 'customerName', 'totalAmount', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
  },
  fields: [
    {
      name: 'orderReference',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'itemType',
          type: 'select',
          options: [
            { label: 'Product', value: 'product' },
            { label: 'Gift Voucher', value: 'voucher' },
            { label: 'Animal Adoption', value: 'adoption' },
          ],
          required: true,
        },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          admin: {
            condition: (_: any, siblingData: any) => siblingData?.itemType === 'product',
          },
        },
        {
          name: 'voucher',
          type: 'relationship',
          relationTo: 'gift-vouchers',
          admin: {
            condition: (_: any, siblingData: any) => siblingData?.itemType === 'voucher',
          },
        },
        {
          name: 'adoption',
          type: 'relationship',
          relationTo: 'adoptions',
          admin: {
            condition: (_: any, siblingData: any) => siblingData?.itemType === 'adoption',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'variant',
          type: 'text',
          admin: {
            description: 'Variant name if applicable',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Price per item in pence at time of order',
          },
        },
      ],
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      options: [
        { label: 'Collection from Farm', value: 'collection' },
        { label: 'Standard Shipping', value: 'shipping' },
      ],
      required: true,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      admin: {
        condition: (data: any) => data?.deliveryMethod === 'shipping',
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
      name: 'shippingCost',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Shipping cost in pence',
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      admin: {
        description: 'Items total in pence (before shipping)',
        readOnly: true,
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      admin: {
        description: 'Grand total in pence (including shipping)',
        readOnly: true,
      },
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending Payment', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Ready for Collection', value: 'ready' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Shipping tracking number',
        condition: (data: any) => data?.deliveryMethod === 'shipping',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this order',
      },
    },
  ],
}
