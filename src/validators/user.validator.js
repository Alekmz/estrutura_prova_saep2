const { z } = require('zod');

const userCreateSchema = z.object({
  nome: z.string().min(3).max(120),
  email: z.string().email().max(160),
  senha: z.string().min(6).max(80),
  perfil: z.enum(['OPERADOR', 'ADMINISTRADOR']).default('OPERADOR'),
  ativo: z.boolean().optional()
});

const userUpdateSchema = z.object({
  nome: z.string().min(3).max(120).optional(),
  email: z.string().email().max(160).optional(),
  senha: z.string().min(6).max(80).optional(),
  perfil: z.enum(['OPERADOR', 'ADMINISTRADOR']).optional(),
  ativo: z.boolean().optional()
});

module.exports = { userCreateSchema, userUpdateSchema };
