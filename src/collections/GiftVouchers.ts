import type { CollectionConfig } from 'payload'

export const GiftVouchers: CollectionConfig = {
  slug: 'gift-vouchers',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'amount', 'purchaserName', 'recipientName', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Unique voucher code',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Voucher value in pence (e.g. 2500 = £25.00)',
      },
    },
    {
      name: 'remainingBalance',
      type: 'number',
      min: 0,
      admin: {
        description: 'Remaining balance in pence (decreases when redeemed)',
      },
    },
    {
      name: 'purchaserName',
      type: 'text',
      required: true,
    },
    {
      name: 'purchaserEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'recipientName',
      type: 'text',
      required: true,
    },
    {
      name: 'recipientEmail',
      type: 'email',
      admin: {
        description: 'If provided, the voucher will be emailed directly to the recipient',
      },
    },
    {
      name: 'personalMessage',
      type: 'textarea',
      maxLength: 500,
      admin: {
        description: 'Personal message to appear on the voucher',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
        description: 'Voucher expiry date (typically 12 months from purchase)',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Partially Redeemed', value: 'partial' },
        { label: 'Fully Redeemed', value: 'redeemed' },
        { label: 'Expired', value: 'expired' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'redemptions',
      type: 'array',
      admin: {
        description: 'History of redemptions against this voucher',
        readOnly: true,
      },
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: { description: 'Amount redeemed in pence' },
        },
        {
          name: 'redeemedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'reference',
          type: 'text',
          admin: { description: 'Booking or order reference' },
        },
      ],
    },
  ],
}
