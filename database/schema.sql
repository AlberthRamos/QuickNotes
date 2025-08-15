-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS crm_db;
USE crm_db;

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notas (conforme solicitado)
CREATE TABLE IF NOT EXISTS notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Inserir dados de teste
INSERT INTO clientes (nome, email, telefone) VALUES
('João Silva', 'joao@email.com', '11999999999'),
('Maria Santos', 'maria@email.com', '11988888888'),
('Carlos Oliveira', 'carlos@email.com', '11977777777');

INSERT INTO usuarios (nome, email, senha) VALUES
('Administrador', 'admin@crm.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- senha: password
('Vendedor 1', 'vendedor@crm.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO notas (texto, cliente_id, usuario_id) VALUES
('Cliente muito satisfeito com o atendimento', 1, 1),
('Ligar de volta na próxima semana', 1, 2),
('Cliente solicitou orçamento', 2, 1),
('Cliente preferencial', 3, 2);