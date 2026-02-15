import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'headline',
          type: 'text',
          defaultValue: 'Welcome to Rutland Farm Park',
          required: true,
        },
        {
          name: 'subheadline',
          type: 'textarea',
          defaultValue: 'Visit our 18-acre family-friendly working farm park in the Market town of Oakham, England\'s smallest County, Rutland.',
        },
        {
          name: 'ctaText',
          type: 'text',
          defaultValue: 'Plan Your Visit',
        },
        {
          name: 'ctaLink',
          type: 'text',
          defaultValue: '/visit',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'announcement',
      type: 'group',
      admin: {
        description: 'Optional announcement banner - great for AI agent updates',
      },
      fields: [
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'message',
          type: 'text',
          admin: {
            condition: (data: any) => data?.announcement?.active,
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Warning', value: 'warning' },
            { label: 'Special', value: 'special' },
          ],
          defaultValue: 'info',
          admin: {
            condition: (data: any) => data?.announcement?.active,
          },
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      maxRows: 3,
      defaultValue: [
        {
          title: 'Animal Encounters',
          description: 'Get up close with our animals — feed, pet, and learn about them in a safe environment.',
          icon: 'heart',
        },
        {
          title: 'Family Events',
          description: 'Join us for exciting events throughout the year, perfect for parents and children to enjoy together.',
          icon: 'calendar',
        },
        {
          title: 'Rare Breeds',
          description: 'Discover rare and heritage breed animals including Lincoln Longwool sheep and Gloucester Old Spot pigs.',
          icon: 'star',
        },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Heart', value: 'heart' },
            { label: 'Calendar', value: 'calendar' },
            { label: 'Star', value: 'star' },
            { label: 'Map Pin', value: 'map-pin' },
            { label: 'Users', value: 'users' },
            { label: 'Coffee', value: 'coffee' },
          ],
          defaultValue: 'star',
        },
      ],
    },
    {
      name: 'animalsSection',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Meet Our Animals',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'At our farm park, visitors can enjoy a delightful encounter with a variety of charming animals. From friendly Hereford cows to playful Shetland ponies, pygmy goats, alpacas, and rare breed sheep and pigs.',
        },
      ],
    },
  ],
}
