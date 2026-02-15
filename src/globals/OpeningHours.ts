import type { GlobalConfig } from 'payload'

export const OpeningHours: GlobalConfig = {
  slug: 'opening-hours',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'summer',
      type: 'group',
      admin: {
        description: 'Summer hours (clocks forward in March to clocks back in October)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Summer',
        },
        {
          name: 'days',
          type: 'text',
          defaultValue: 'Tuesday – Sunday',
        },
        {
          name: 'hours',
          type: 'text',
          defaultValue: '10am – 5pm',
        },
        {
          name: 'lastEntry',
          type: 'text',
          defaultValue: '4:30pm',
        },
        {
          name: 'closedDays',
          type: 'text',
          defaultValue: 'Monday – CLOSED',
        },
      ],
    },
    {
      name: 'winter',
      type: 'group',
      admin: {
        description: 'Winter hours (clocks back in October to clocks forward in March)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Winter',
        },
        {
          name: 'days',
          type: 'text',
          defaultValue: 'Tuesday – Sunday',
        },
        {
          name: 'hours',
          type: 'text',
          defaultValue: '10am – 4pm',
        },
        {
          name: 'lastEntry',
          type: 'text',
          defaultValue: '3:00pm',
        },
        {
          name: 'closedDays',
          type: 'text',
          defaultValue: 'Monday – CLOSED',
        },
      ],
    },
    {
      name: 'notes',
      type: 'array',
      fields: [
        {
          name: 'note',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { note: 'Open on Bank Holiday Mondays' },
        { note: 'Open Mondays during School Holidays' },
        { note: 'Closed Christmas Day and New Years Day' },
      ],
    },
    {
      name: 'todayOverride',
      type: 'group',
      admin: {
        description: 'Override for today - useful for AI agent updates',
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
            description: 'e.g. "Closed today due to weather" or "Open until 6pm today"',
            condition: (data: any) => data?.todayOverride?.active,
          },
        },
      ],
    },
  ],
}
