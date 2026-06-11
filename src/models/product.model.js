const { pool } = require('../config/database');

function buildListQuery(filters) {
  const where = [];
  const values = [];
  let idx = 1;

  if (filters.nome) {
    where.push(`nome ILIKE $${idx++}`);
    values.push(`%${filters.nome}%`);
  }

  if (filters.dataInicio) {
    where.push(`DATE(data_cadastro) >= $${idx++}`);
    values.push(filters.dataInicio);
  }

  if (filters.dataFim) {
    where.push(`DATE(data_cadastro) <= $${idx++}`);
    values.push(filters.dataFim);
  }

  const whereSql = where.length
    ? `WHERE ${where.join(' AND ')}`
    : '';

  return { whereSql, values, nextIdx: idx };
}

async function list({
  page = 1,
  limit = 10,
  nome,
  dataInicio,
  dataFim
} = {}) {

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const offset = (safePage - 1) * safeLimit;

  const {
    whereSql,
    values,
    nextIdx
  } = buildListQuery({
    nome,
    dataInicio,
    dataFim
  });

  const { rows: items } = await pool.query(
    `
    SELECT
      id,
      nome,
      categoria,
      quantidade,
      valor_unitario,
      data_cadastro,
      atualizado_em
    FROM produtos
    ${whereSql}
    ORDER BY nome
    LIMIT $${nextIdx}
    OFFSET $${nextIdx + 1}
    `,
    [...values, safeLimit, offset]
  );

  const { rows: countRows } = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM produtos
    ${whereSql}
    `,
    values
  );

  const total = Number(countRows[0].total);

  return {
    items,
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit)
  };
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM produtos WHERE id = $1',
    [id]
  );

  return rows[0] || null;
}

async function create(data) {

  const { rows } = await pool.query(
    `
    INSERT INTO produtos
    (
      nome,
      categoria,
      quantidade,
      valor_unitario
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING id
    `,
    [
      data.nome,
      data.categoria,
      data.quantidade,
      data.valor_unitario
    ]
  );

  return findById(rows[0].id);
}

async function update(id, data) {

  const fields = [];
  const values = [];
  let idx = 1;

  for (const key of [
    'nome',
    'categoria',
    'quantidade',
    'valor_unitario'
  ]) {

    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(data[key]);
    }

  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);

  await pool.query(
    `
    UPDATE produtos
    SET ${fields.join(', ')}
    WHERE id = $${idx}
    `,
    values
  );

  return findById(id);
}

async function remove(id) {

  const result = await pool.query(
    'DELETE FROM produtos WHERE id = $1',
    [id]
  );

  return result.rowCount > 0;
}

module.exports = {
  create,
  findById,
  list,
  remove,
  update
};