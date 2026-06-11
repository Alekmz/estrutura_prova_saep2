const { z } = require('zod');

const productCreateSchema = z.object({
  nome: z.string().min(2).max(160),
  descricao: z.string().max(1000).optional().nullable(),
  quantidade: z.number().nonnegative().default(0),
  unidade: z.string().min(1).max(20).default('UN')
});

const productUpdateSchema = z.object({
  nome: z.string().min(2).max(160).optional(),
  descricao: z.string().max(1000).optional().nullable(),
  quantidade: z.number().nonnegative().optional(),
  unidade: z.string().min(1).max(20).optional()
});

module.exports = { productCreateSchema, productUpdateSchema };
