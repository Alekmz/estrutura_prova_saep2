const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1)
});

module.exports = { loginSchema };
