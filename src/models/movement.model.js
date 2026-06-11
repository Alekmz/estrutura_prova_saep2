const { pool } = require('../config/database');

async function executeStockMovement({ produtoId, usuarioId, tipo, quantidade, observacao }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: [product] } = await client.query(
      'SELECT id, nome, quantidade FROM produtos WHERE id = $1 FOR UPDATE',
      [produtoId]
    );

    if (!product) {
      const notFound = new Error('Produto nao encontrado.');
      notFound.code = 'PRODUCT_NOT_FOUND';
      throw notFound;
    }

    const saldoAnterior = Number(product.quantidade);
    const saldoAtual = tipo === 'ENTRADA'
      ? saldoAnterior + quantidade
      : saldoAnterior - quantidade;

    await client.query(
      'UPDATE produtos SET quantidade = $1 WHERE id = $2',
      [saldoAtual, produtoId]
    );

    const { rows: [inserted] } = await client.query(
      `INSERT INTO movimentacoes
       (produto_id, usuario_id, tipo, quantidade, saldo_anterior, saldo_atual, observacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [produtoId, usuarioId, tipo, quantidade, saldoAnterior, saldoAtual, observacao || null]
    );

    const { rows: [movement] } = await client.query(
      `SELECT m.id, m.produto_id AS "produtoId", p.nome AS "produtoNome",
              m.usuario_id AS "usuarioId", u.nome AS "usuarioNome", m.tipo,
              m.quantidade, m.saldo_anterior AS "saldoAnterior",
              m.saldo_atual AS "saldoAtual", m.observacao, m.criado_em AS "criadoEm"
       FROM movimentacoes m
       JOIN produtos p ON p.id = m.produto_id
       JOIN usuarios u ON u.id = m.usuario_id
       WHERE m.id = $1`,
      [inserted.id]
    );

    await client.query('COMMIT');
    return movement;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function list() {
  const { rows } = await pool.query(
    `SELECT m.id, m.produto_id AS "produtoId", p.nome AS "produtoNome",
            m.usuario_id AS "usuarioId", u.nome AS "usuarioNome", m.tipo,
            m.quantidade, m.saldo_anterior AS "saldoAnterior",
            m.saldo_atual AS "saldoAtual", m.observacao, m.criado_em AS "criadoEm"
     FROM movimentacoes m
     JOIN produtos p ON p.id = m.produto_id
     JOIN usuarios u ON u.id = m.usuario_id
     ORDER BY m.criado_em DESC, m.id DESC`
  );
  return rows;
}

module.exports = { executeStockMovement, list };
