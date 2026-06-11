const { z } = require('zod');
const { passwordSchema, nameSchema } = require('./authValidators');

const createUserSchema = z.object({
  name: nameSchema,
  email: z.string().email('Invalid email address'),
  address: z.string().max(400, 'Address must be at most 400 characters').optional().default(''),
  password: passwordSchema,
  role: z.enum(['ADMIN', 'STORE_OWNER', 'USER']).optional().default('USER'),
});

module.exports = { createUserSchema };
