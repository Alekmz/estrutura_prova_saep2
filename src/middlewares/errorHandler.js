const { ZodError } = require('zod');
const { AppError } = require('../errors/AppError');

function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ errors: err.errors });
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err.code === 'PRODUCT_NOT_FOUND') {
    return res.status(404).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
}

module.exports = { errorHandler };
