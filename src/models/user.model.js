const { pool } = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, nome, email, perfil, ativo, criado_em, atualizado_em FROM usuarios ORDER BY nome'
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, nome, email, perfil, ativo, criado_em, atualizado_em FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0] || null;
}

async function create(data) {
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nome, email, senha_hash, perfil, ativo) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [data.nome, data.email, data.senhaHash, data.perfil, data.ativo ?? true]
  );
  return findById(rows[0].id);
}

async function update(id, data) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, column] of [
    ['nome', 'nome'],
    ['email', 'email'],
    ['senhaHash', 'senha_hash'],
    ['perfil', 'perfil'],
    ['ativo', 'ativo']
  ]) {
    if (data[key] !== undefined) {
      fields.push(`${column} = $${idx++}`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);
  await pool.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${idx}`, values);
  return findById(id);
}

async function remove(id) {
  const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = { create, findAll, findByEmail, findById, remove, update };
