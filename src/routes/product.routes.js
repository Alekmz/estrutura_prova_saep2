const { Router } = require('express');
const { AppError } = require('../errors/AppError');
const productModel = require('../models/product.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { productCreateSchema, productUpdateSchema } = require('../validators/product.validator');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const result = await productModel.list(req.query);
  res.json(result);
}));

router.post('/', asyncHandler(async (req, res) => {
  const data = productCreateSchema.parse(req.body);
  const product = await productModel.create(data);
  res.status(201).json(product);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const data = productUpdateSchema.parse(req.body);
  const id = Number(req.params.id);

  const existing = await productModel.findById(id);
  if (!existing) {
    throw new AppError('Produto nao encontrado.', 404);
  }

  const product = await productModel.update(id, data);
  res.json(product);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const removed = await productModel.remove(id);
  if (!removed) {
    throw new AppError('Produto nao encontrado.', 404);
  }
  res.status(204).send();
}));

module.exports = router;
