import type { GlobalConfig } from 'payload'

export const ShopSettings: GlobalConfig = {
  slug: 'shop-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'shipping',
      type: 'group',
      fields: [
        {
          name: 'standardRate',
          type: 'number',
          required: true,
          defaultValue: 395,
          admin: {
            description: 'Standard shipping rate in pence (e.g. 395 = £3.95)',
          },
        },
        {
          name: 'freeShippingThreshold',
          type: 'number',
          defaultValue: 3000,
          admin: {
            description: 'Free shipping for orders over this amount in pence (e.g. 3000 = £30.00). Set to 0 to disable.',
          },
        },
        {
          name: 'shippingNote',
          type: 'text',
          defaultValue: 'Free delivery on orders over £30',
          admin: {
            description: 'Displayed to customers on the shop page',
          },
        },
      ],
    },
    {
      name: 'collection',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'instructions',
          type: 'textarea',
          defaultValue: 'Collect your order from the shop at Rutland Farm Park during opening hours. You will receive an email when your order is ready.',
        },
      ],
    },
    {
      name: 'voucherAmounts',
      type: 'array',
      admin: {
        description: 'Preset gift voucher amounts customers can choose from',
      },
      defaultValue: [
        { amount: 1000, label: '£10' },
        { amount: 2500, label: '£25' },
        { amount: 5000, label: '£50' },
        { amount: 7500, label: '£75' },
        { amount: 10000, label: '£100' },
      ],
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: { description: 'Amount in pence' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Display label (e.g. "£25")' },
        },
      ],
    },
    {
      name: 'adoptionEnabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable/disable the animal adoption feature',
      },
    },
  ],
}
