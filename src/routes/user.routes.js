const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { AppError } = require('../errors/AppError');
const userModel = require('../models/user.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { userCreateSchema, userUpdateSchema } = require('../validators/user.validator');

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const users = await userModel.findAll();
  res.json(users);
}));

router.post('/', asyncHandler(async (req, res) => {
  const data = userCreateSchema.parse(req.body);

  const existing = await userModel.findByEmail(data.email);
  if (existing) {
    throw new AppError('Ja existe usuario cadastrado com este email.', 409);
  }

  const senhaHash = await bcrypt.hash(data.senha, 10);
  const user = await userModel.create({ ...data, senhaHash });
  res.status(201).json(user);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const data = userUpdateSchema.parse(req.body);
  const id = Number(req.params.id);

  const existing = await userModel.findById(id);
  if (!existing) {
    throw new AppError('Usuario nao encontrado.', 404);
  }

  const payload = { ...data };
  if (payload.senha) {
    payload.senhaHash = await bcrypt.hash(payload.senha, 10);
    delete payload.senha;
  }

  const user = await userModel.update(id, payload);
  res.json(user);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const removed = await userModel.remove(id);
  if (!removed) {
    throw new AppError('Usuario nao encontrado.', 404);
  }
  res.status(204).send();
}));

module.exports = router;
