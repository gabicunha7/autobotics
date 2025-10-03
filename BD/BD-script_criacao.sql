DROP DATABASE IF EXISTS autobotics;
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
  id_setor INT NOT NULL auto_increment,
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
  nome VARCHAR(50),
  CONSTRAINT fk_cargo_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

-- Funcionario (Separados em setores)
CREATE TABLE funcionario (
  id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  ativo TINYINT DEFAULT 1,
  fk_empresa INT NOT NULL,
  fk_setor INT,
  fk_cargo INT NOT NULL,
  CONSTRAINT fk_funcionario_setor FOREIGN KEY (fk_setor, fk_empresa) REFERENCES setor(id_setor, fk_empresa),
  CONSTRAINT fk_funcionario_cargo FOREIGN KEY (fk_cargo) REFERENCES cargo(id_cargo),
  UNIQUE ix_email (email)
);


-- Controlador (pertence a um setor;)
CREATE TABLE controlador (
  id_controlador INT AUTO_INCREMENT PRIMARY KEY,
  numero_serial VARCHAR(120) UNIQUE,
  status VARCHAR(30) DEFAULT 'ativo',
  fk_empresa INT NOT NULL,
  fk_setor INT NOT NULL,
  CONSTRAINT fk_controlador_setor FOREIGN KEY (fk_setor, fk_empresa) REFERENCES setor(id_setor, fk_empresa)
);

create table componente (
	id_componente int primary key auto_increment,
	nome varchar(15),
	fk_empresa INT NOT NULL,
	fk_setor INT NOT NULL,
	CONSTRAINT fk_componente_setor FOREIGN KEY (fk_setor, fk_empresa) REFERENCES setor(id_setor, fk_empresa)
);
-- Parametrização dos alertas
CREATE TABLE parametrizacao(
  id_parametro int auto_increment primary key,
  fk_componente INT NOT NULL,
  regras JSON,
  min int,
  max int,
  CONSTRAINT fk_parametro_componente FOREIGN KEY (fk_componente) REFERENCES componente(id_componente)
);

DROP USER IF EXISTS "agente";
CREATE USER "agente" IDENTIFIED BY "sptech";
GRANT ALL PRIVILEGES on autobotics.* TO "agente";
FLUSH PRIVILEGES;


INSERT INTO cargo(nome) VALUES ('Eng_Robotica'), ('Eng_Manutencao');

insert into endereco(estado, cidade, cep, bairro, logradouro)
values ("SP", "Bragança Paulista", "12900-130", "Centro", "Praça José Bonifácio");

insert into empresa(nome, cnpj, fk_endereco, status)
values ("Teste", "12.312.321/3123-12", 1, "APROVADA");

delimiter $$
create trigger after_insert_setor
after insert on setor
for each row
begin
	insert into componente (nome, fk_empresa, fk_setor)
	values  ("CPU", new.fk_empresa, new.id_setor),
			("RAM", new.fk_empresa, new.id_setor),
            ("Disco", new.fk_empresa, new.id_setor);
end;
$$
delimiter ;

insert into setor(nome, descricao, fk_empresa)
values ("SETOR DE TESTES", "Este setor é um exemplo de um teste a ser utilizado", 1);

insert into funcionario (nome, email, fk_setor, fk_empresa, ativo, fk_cargo, senha_hash)
values ("teste", "teste@gmail.com", 1, 1, 1, 2, SHA2("senha123", 256));