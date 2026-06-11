const { z } = require('zod');

const productCreateSchema = z.object({
  nome: z.string(),
  categoria: z.string(),
  quantidade: z.number(),
  valor_unitario: z.number()
});

const productUpdateSchema = productCreateSchema.partial();

module.exports = {
  productCreateSchema,
  productUpdateSchema
};