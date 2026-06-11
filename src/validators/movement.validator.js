const { z } = require('zod');

const movementCreateSchema = z.object({
  produtoId: z.number().int().positive(),
  quantidade: z.number().positive(),
  observacao: z.string().max(255).optional().nullable()
});

module.exports = { movementCreateSchema };
