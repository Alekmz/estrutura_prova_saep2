const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');

const router = Router();

router.post('/login', asyncHandler(async (_req, res) => {
  res.status(501).json({ message: 'Autenticacao nao implementada.' });
}));

module.exports = router;
