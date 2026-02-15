import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'inStock', 'active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly name for the product page',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Brief description for listing cards (max 200 chars)',
      },
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in pence (e.g. 1500 = £15.00)',
      },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Original price in pence if on sale (leave empty if not on sale)',
      },
    },
    {
      name: 'variants',
      type: 'array',
      admin: {
        description: 'Optional variants (e.g. size, colour). Leave empty if product has no variants.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. "Small", "Red", "250g"',
          },
        },
        {
          name: 'priceOverride',
          type: 'number',
          min: 0,
          admin: {
            description: 'Price in pence if different from base price (leave empty to use base price)',
          },
        },
        {
          name: 'stock',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'sku',
          type: 'text',
        },
      ],
    },
    {
      name: 'stock',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Stock quantity (used when product has no variants)',
        condition: (data: any) => !data?.variants?.length,
      },
    },
    {
      name: 'weight',
      type: 'number',
      min: 0,
      admin: {
        description: 'Weight in grams (used for shipping calculation)',
      },
    },
    {
      name: 'requiresShipping',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Uncheck for digital products or collection-only items',
      },
    },
    {
      name: 'allowCollection',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Can this item be collected in person from the farm?',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage or shop landing page',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
