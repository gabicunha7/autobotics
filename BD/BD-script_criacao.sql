CREATE DATABASE autobotics;
USE autobotics;

-- Endereco
CREATE TABLE endereco (
  id_endereco INT PRIMARY KEY AUTO_INCREMENT,
  estado VARCHAR(45),
  cidade VARCHAR(80),
  bairro VARCHAR(80),
  logradouro VARCHAR(150),
  cep VARCHAR(20)
);

-- Empresa / fabricante
CREATE TABLE empresa (
  id_empresa INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  cnpj CHAR(18) NOT NULL,
  fk_endereco INT,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE', 
  CONSTRAINT chk_status CHECK (status in ('PENDENTE', 'APROVADA', 'REPROVADA')),
  CONSTRAINT fk_empresa_endereco FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco),
  UNIQUE ix_cnpj (cnpj)
);

-- Setor / departamento (vinculado a uma empresa)
CREATE TABLE setor (
  id_setor INT NOT NULL,
  fk_empresa INT NOT NULL,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  CONSTRAINT fk_setor_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
  PRIMARY KEY (id_setor, fk_empresa)
);

-- Cargo
CREATE TABLE cargo (
  id_cargo INT PRIMARY KEY AUTO_INCREMENT,
  fk_empresa INT,
  cargo VARCHAR(50),
  pode_editar TINYINT(1),
  pode_excluir TINYINT(1),
  pode_inserir TINYINT(1),
  CONSTRAINT fk_cargo_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

-- Funcionario (Separados em setores)
CREATE TABLE funcionario (
  id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  fk_empresa INT NOT NULL,
  fk_setor INT,
  fk_cargo INT NOT NULL,
  fk_superior INT,
  CONSTRAINT fk_funcionario_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
  CONSTRAINT fk_funcionario_setor FOREIGN KEY (fk_setor) REFERENCES setor(id_setor),
  CONSTRAINT fk_funcionario_cargo FOREIGN KEY (fk_cargo) REFERENCES cargo(id_cargo),
  CONSTRAINT fk_funcionario_superior FOREIGN KEY (fk_superior) REFERENCES funcionario(id_funcionario),
  UNIQUE ix_email (email)
);


-- Controlador (pertence a um setor;)
CREATE TABLE controlador (
  id_controlador INT AUTO_INCREMENT PRIMARY KEY,
  modelo VARCHAR(120) NOT NULL,
  numero_serial VARCHAR(120) UNIQUE,
  firmware VARCHAR(80),
  status VARCHAR(30) DEFAULT 'ativo',
  modelo_cpu VARCHAR(100),
  ram_mb INT,
  storage_mb INT,
  fk_empresa INT NOT NULL,
  fk_setor INT NOT NULL,
  CONSTRAINT fk_controlador_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
  CONSTRAINT fk_controlador_setor FOREIGN KEY (fk_setor) REFERENCES setor(id_setor)
);

-- Parametrização dos alertas
CREATE TABLE parametrizacao_alerta(
  fk_empresa INT NOT NULL,
  fk_setor INT NOT NULL,
  regras JSON,
  componente VARCHAR(30),
  valor_min DECIMAL(5,2),
  valor_max DECIMAL(5,2),
  CONSTRAINT fk_parametro_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
  CONSTRAINT fk_parametro_setor FOREIGN KEY (fk_setor) REFERENCES setor(id_setor),
  PRIMARY KEY (fk_empresa, fk_setor)
);

CREATE USER "aluno" IDENTIFIED BY "sptech";
GRANT ALL PRIVILEGES on autobotics.* TO "aluno";
FLUSH PRIVILEGES;


INSERT INTO cargo(cargo, pode_editar, pode_excluir, pode_inserir) VALUES ("Representante", 1, 1, 1);