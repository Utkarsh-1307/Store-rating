const { z } = require('zod');

const createStoreSchema = z.object({
  name: z
    .string()
    .min(20, 'Store name must be at least 20 characters')
    .max(60, 'Store name must be at most 60 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required').max(400, 'Address must be at most 400 characters'),
  ownerId: z.number().int().positive('Owner ID must be a positive integer'),
});

module.exports = { createStoreSchema };
