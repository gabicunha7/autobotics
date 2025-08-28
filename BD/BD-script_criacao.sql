CREATE DATABASE IF NOT EXISTS autobotics;
USE autobotics;

-- Endereco
CREATE TABLE endereco (
  id_endereco INT AUTO_INCREMENT PRIMARY KEY,
  estado VARCHAR(45),
  cidade VARCHAR(80),
  bairro VARCHAR(80),
  logradouro VARCHAR(150),
  cep VARCHAR(20)
);

-- Empresa / fabricante
CREATE TABLE empresa (
  id_empresa INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cnpj VARCHAR(20),
  telefone VARCHAR(30),
  fk_endereco INT,
  status ENUM('PENDENTE', 'APROVADA', 'REPROVADA') NOT NULL DEFAULT 'PENDENTE'
  CONSTRAINT fk_empresa_endereco FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco)
);

-- Setor / departamento (vinculado a uma empresa)
CREATE TABLE setor (
  id_setor INT AUTO_INCREMENT PRIMARY KEY,
  fk_empresa INT NOT NULL,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  regras JSON DEFAULT ('{}'),
  CONSTRAINT fk_setor_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa) ON DELETE CASCADE
);

-- Funcionario (Separados em setores)
CREATE TABLE funcionario (
  id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
  fk_empresa INT,
  fk_setor INT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  senha_hash VARCHAR(255),
  cpf VARCHAR(20),
  cargo VARCHAR(100),
  nivel_de_acesso VARCHAR(50),
  ativo TINYINT(1) DEFAULT 1,
  CONSTRAINT fk_funcionario_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
  CONSTRAINT fk_funcionario_setor FOREIGN KEY (fk_setor) REFERENCES setor(id_setor)
);

-- Controlador (pertence a um setor;)
CREATE TABLE controlador (
  id_controlador INT AUTO_INCREMENT PRIMARY KEY,
  fk_empresa INT NOT NULL,
  fk_setor INT NOT NULL,
  modelo VARCHAR(120) NOT NULL,
  numero_serial VARCHAR(120) UNIQUE,
  firmware VARCHAR(80),
  status VARCHAR(30) DEFAULT 'ativo',
  modelo_cpu VARCHAR(100),
  ram_mb INT,
  storage_mb INT,
  CONSTRAINT fk_controlador_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa) ON DELETE CASCADE,
  CONSTRAINT fk_controlador_setor FOREIGN KEY (fk_setor) REFERENCES setor(id_setor) ON DELETE CASCADE
);

-- Alerta 
CREATE TABLE alerta (
  id_alerta BIGINT AUTO_INCREMENT PRIMARY KEY,
  fk_controlador INT NOT NULL,
  `timestamp` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  cpu_pct DECIMAL(5,2),
  ram_pct DECIMAL(5,2),
  disk_pct DECIMAL(5,2),
  tipo VARCHAR(80),
  mensagem TEXT,
  CONSTRAINT fk_alerta_controlador FOREIGN KEY (fk_controlador) REFERENCES controlador(id_controlador) ON DELETE CASCADE
) ;
