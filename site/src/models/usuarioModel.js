// src/models/funcionarioModel.js
var database = require("../database/config");

function cadastrarFuncionario(
    fk_empresa,
    fk_setor,
    nome,
    email,
    senha_hash,
    cargo
) {
    var sql = `
    INSERT INTO funcionario
      (fk_empresa, fk_setor, nome, email, senha_hash, fk_cargo)
    VALUES
      (${fk_empresa}, ${fk_setor === null ? "NULL" : fk_setor},
       '${nome}',    '${email}', SHA2('${senha_hash}', 256),
       ${cargo ? 2 : "NULL"})
  `;
    return database.executar(sql);
}

function buscarPorEmail(email) {
    var sql = `
    SELECT *
      FROM funcionario
     WHERE email = '${email}'
       AND ativo = 1 
  `;
    return database.executar(sql);
}


function buscarPorEmailComStatus(email, senha) {
    var sql = `
    SELECT
      f.id_funcionario,
      f.nome,
      f.email,
      f.fk_cargo,
      f.fk_empresa,
      f.ativo,
      f.fk_setor,
      e.status AS status_empresa
    FROM funcionario AS f
    JOIN empresa    AS e
      ON f.fk_empresa = e.id_empresa
    WHERE f.email = '${email}'
      AND f.ativo = 1 and senha_hash = sha2('${senha}',256)
  `;
    return database.executar(sql);
}

module.exports = {
    cadastrarFuncionario,
    buscarPorEmail,
    buscarPorEmailComStatus
};