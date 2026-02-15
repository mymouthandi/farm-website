import type { CollectionConfig } from 'payload'

export const AdoptionTiers: CollectionConfig = {
  slug: 'adoption-tiers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'order'],
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
        description: 'e.g. "Bronze", "Silver", "Gold"',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Annual adoption price in pence (e.g. 2500 = £25.00)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'What the adopter receives at this tier',
      },
    },
    {
      name: 'includes',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'List of what is included (e.g. "Certificate", "Photo", "Cuddly toy")',
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
