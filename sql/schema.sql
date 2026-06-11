CREATE DATABASE almoxarifado_saep;

\c almoxarifado_saep;

CREATE TYPE perfil_usuario AS ENUM ('OPERADOR', 'ADMINISTRADOR');
CREATE TYPE tipo_movimentacao AS ENUM ('ENTRADA', 'SAIDA');

CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil perfil_usuario NOT NULL DEFAULT 'OPERADOR',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_usuarios_atualizado_em
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  quantidade NUMERIC(12,3) NOT NULL DEFAULT 0,
  valor_unitario NUMERIC(10,2) NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos (nome);
CREATE INDEX IF NOT EXISTS idx_produtos_data_cadastro ON produtos (data_cadastro);

CREATE TRIGGER trg_produtos_atualizado_em
BEFORE UPDATE ON produtos
FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE VIEW vw_estoque AS
SELECT
  id,
  nome,
  categoria,
  quantidade,
  valor_unitario,
  quantidade * valor_unitario AS valor_total
FROM produtos;

CREATE TABLE IF NOT EXISTS movimentacoes (
  id SERIAL PRIMARY KEY,
  produto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  tipo tipo_movimentacao NOT NULL,
  quantidade NUMERIC(12, 3) NOT NULL,
  saldo_anterior NUMERIC(12, 3) NOT NULL,
  saldo_atual NUMERIC(12, 3) NOT NULL,
  observacao VARCHAR(255) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_movimentacoes_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
  CONSTRAINT fk_movimentacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_movimentacoes_criado_em ON movimentacoes (criado_em);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_produto ON movimentacoes (produto_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_usuario ON movimentacoes (usuario_id);

INSERT INTO usuarios (nome, email, senha_hash, perfil)
SELECT 'Administrador', 'admin@almoxarifado.local', '$2a$10$Aw93fnrpuB41kNXViAWKZOu.w5Swa2CCDzbF0E9YhDoG.pxCs9o6.', 'ADMINISTRADOR'
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE email = 'admin@almoxarifado.local'
);

INSERT INTO produtos
(nome, categoria, quantidade, valor_unitario)
VALUES
('Ypê','Limpeza',100,5.50),
('alcol','Higiene',80,8.90),
('sabaoempo','Limpeza',50,12.00);

INSERT INTO movimentacoes
(produto_id, usuario_id, tipo, quantidade, saldo_anterior, saldo_atual, observacao)
VALUES
(1,1,'ENTRADA',100,0,100,'Carga inicial'),
(2,1,'ENTRADA',80,0,80,'Carga inicial'),
(3,1,'ENTRADA',50,0,50,'Carga inicial');