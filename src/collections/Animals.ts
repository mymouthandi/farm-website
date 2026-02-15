import type { CollectionConfig } from 'payload'

export const Animals: CollectionConfig = {
  slug: 'animals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'breed', 'isRareBreed', 'updatedAt'],
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
      name: 'breed',
      type: 'text',
      required: true,
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
        description: 'Brief description for card views (max 200 chars)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'isRareBreed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this a rare breed animal?',
      },
    },
    {
      name: 'rareBreedInfo',
      type: 'richText',
      admin: {
        condition: (data: any) => data?.isRareBreed,
        description: 'Additional information about this rare breed',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
      defaultValue: 0,
    },
  ],
}
