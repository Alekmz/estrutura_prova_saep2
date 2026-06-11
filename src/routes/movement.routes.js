const { Router } = require('express');
const { AppError } = require('../errors/AppError');
const movementModel = require('../models/movement.model');
const productModel = require('../models/product.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { movementCreateSchema } = require('../validators/movement.validator');

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const movements = await movementModel.list();
  res.json(movements);
}));

router.post('/entrada', asyncHandler(async (req, res) => {
  const data = movementCreateSchema.parse(req.body);
  const movement = await movementModel.executeStockMovement({
    ...data,
    tipo: 'ENTRADA',
    usuarioId: req.user?.id ?? 1
  });
  res.status(201).json(movement);
}));

router.post('/saida', asyncHandler(async (req, res) => {
  const data = movementCreateSchema.parse(req.body);

  const product = await productModel.findById(data.produtoId);
  if (!product) {
    throw new AppError('Produto nao encontrado.', 404);
  }

  if (data.quantidade > Number(product.quantidade)) {
    throw new AppError(
      `Saida nao permitida: estoque insuficiente. Disponivel: ${Number(product.quantidade)}. Solicitado: ${data.quantidade}.`,
      422
    );
  }

  const movement = await movementModel.executeStockMovement({
    ...data,
    tipo: 'SAIDA',
    usuarioId: req.user?.id ?? 1
  });
  res.status(201).json(movement);
}));

module.exports = router;
